use std::cmp::min;

use rand::seq::SliceRandom;

pub struct ContinuousYoficationPages {
    // для каждого числа k от 0 до <максимальное число замен в страницах> найдём число страниц n, у которых больше чем k замен
    // чтобы в /randomPageName выбирать только из этих n страниц
    number_pages_with_number_replaces_more_than: Vec<usize>,
    all_pages: Vec<String>,
}

impl ContinuousYoficationPages {
    pub fn new() -> Self {
        // в файле хранятся строки — пары (число замен, имя страницы)
        // причём эти пары уже отсортированы по числу замен по убыванию
        const ALL_PAGES_URL: &str = "https://raw.githubusercontent.com/dima74/Wikipedia-Yofication/frequencies/all-pages.txt";
        let response = reqwest::get(ALL_PAGES_URL).unwrap().text().unwrap();

        let mut all_pages = Vec::new();
        let mut pages_number_replaces: Vec<usize> = Vec::new();
        for line in response.lines() {
            let mut tokens = line.splitn(2, ' ');
            let number_replaces = tokens.next().unwrap().parse().unwrap();
            let title = tokens.next().unwrap().to_string();
            all_pages.push(title);
            pages_number_replaces.push(number_replaces);
        }

        let maximum_number_replaces = pages_number_replaces[0];
        assert!(maximum_number_replaces < 10000);  // обычно оно равно 500=600

        let mut number_pages_with_number_replaces_more_than = vec![0usize; maximum_number_replaces + 1];
        let mut current_number_pages = pages_number_replaces.len();
        let mut pages_number_replaces_iter = pages_number_replaces.iter().rev().peekable();
        for (number_replaces, number_pages) in number_pages_with_number_replaces_more_than.iter_mut().enumerate() {
            *number_pages = current_number_pages;
            while let Some(page_number_replaces) = pages_number_replaces_iter.peek() {
                // todo while-let-chains https://github.com/rust-lang/rust/issues/53667
                if **page_number_replaces == number_replaces {
                    pages_number_replaces_iter.next();
                    current_number_pages -= 1;
                } else {
                    break;
                }
            }
        }

        ContinuousYoficationPages { number_pages_with_number_replaces_more_than, all_pages }
    }

    pub fn get_random_page(self: &Self, mut minimum_number_replaces: usize) -> String {
        let maximum_number_replaces = self.number_pages_with_number_replaces_more_than.len() - 1;
        minimum_number_replaces = min(minimum_number_replaces, maximum_number_replaces);
        let number_pages_to_choice = self.number_pages_with_number_replaces_more_than[minimum_number_replaces];
        let mut rng = rand::thread_rng();
        self.all_pages[..number_pages_to_choice].choose(&mut rng).unwrap().to_owned()
    }
}
