use std::error::Error;
use std::panic::{catch_unwind, AssertUnwindSafe};
use std::sync::{Arc, RwLock};
use std::thread;
use std::time::Duration;

use yofication::yofication::Yofication;

use crate::continuous_yofication_pages::ContinuousYoficationPages;
use crate::words_pages::WordsPages;

const REFRESH_INTERVAL: Duration = Duration::from_secs(24 * 60 * 60);
const RETRY_INTERVAL_AFTER_ERROR: Duration = Duration::from_secs(5 * 60);

pub struct Data {
    pub continuous_yofication_pages: ContinuousYoficationPages,
    pub yofication: Yofication,
    pub words_pages: WordsPages,
}

impl Data {
    fn new() -> Result<Self, Box<dyn Error>> {
        Ok(Self {
            continuous_yofication_pages: ContinuousYoficationPages::new(),
            yofication: Yofication::new()?,
            words_pages: WordsPages::new(),
        })
    }
}

struct AllDataState {
    data: Arc<Data>,
}

pub struct AllData {
    state: Arc<RwLock<AllDataState>>,
}

impl AllData {
    pub fn new() -> Result<Self, Box<dyn Error>> {
        let state = AllDataState { data: Arc::new(Data::new()?) };
        let all_data = Self {
            state: Arc::new(RwLock::new(state)),
        };
        all_data.start_refresh_thread();
        Ok(all_data)
    }

    pub fn get_data(&self) -> Arc<Data> {
        let state = self.state.read().unwrap();
        Arc::clone(&state.data)
    }

    fn start_refresh_thread(&self) {
        let state = Arc::clone(&self.state);
        thread::spawn(move || {
            let mut refresh_interval = REFRESH_INTERVAL;
            loop {
                thread::sleep(refresh_interval);

                match catch_unwind(AssertUnwindSafe(Data::new)) {
                    Ok(Ok(data)) => {
                        let mut state = state.write().unwrap();
                        state.data = Arc::new(data);
                        refresh_interval = REFRESH_INTERVAL;
                    }
                    Ok(Err(error)) => {
                        eprintln!("Failed to refresh backend data: {}", error);
                        refresh_interval = RETRY_INTERVAL_AFTER_ERROR;
                    }
                    Err(_) => {
                        eprintln!("Failed to refresh backend data: panic while rebuilding data");
                        refresh_interval = RETRY_INTERVAL_AFTER_ERROR;
                    }
                }
            }
        });
    }
}
