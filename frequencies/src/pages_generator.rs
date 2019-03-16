use std::cmp::Reverse;
use std::collections::HashSet;
use std::fs::File;
use std::io::{LineWriter, Write};

use crate::string_utils::deyoficate;
use crate::yoword_info::YowordInfo;

const MINIMUM_NUMBER_REPLACES: u32 = 5;
const MINIMUM_REPLACE_FREQUENCY: f32 = 0.35;

struct PageInfo {
    title: String,
    number_replaces: u32,  // для такой как выше minimum_replace_frequency
}

pub struct PagesGenerator {
    ewords: HashSet<String>,
    page_infos: Vec<PageInfo>,
}

impl PagesGenerator {
    pub fn new(old_yoword_infos: &Vec<YowordInfo>) -> PagesGenerator {
        let ewords: HashSet<_> = old_yoword_infos.iter()
            .filter(|yoword| yoword.frequency() > MINIMUM_REPLACE_FREQUENCY)
            .map(|yoword| deyoficate(&yoword.yoword))
            .collect();
        PagesGenerator { ewords, page_infos: Vec::new() }
    }

    pub fn parse(&mut self, title: String, words: &Vec<String>) {
        let number_replaces = words
            .into_iter()
            .filter(|word| self.ewords.contains(*word))
            .count() as u32;

        if number_replaces >= MINIMUM_NUMBER_REPLACES {
            self.page_infos.push(PageInfo { title, number_replaces });
        }
    }

    pub fn save_result(mut self, file_name: &str) {
        self.page_infos.sort_by_key(|info| Reverse(info.number_replaces));

        let file = File::create(file_name).unwrap();
        let mut file = LineWriter::new(file);
        for page_info in self.page_infos {
            writeln!(file, "{} {}", page_info.number_replaces, page_info.title).unwrap();
        }
    }
}
