use std::cmp::{max, min};
use std::fs;

use rand::seq::SliceRandom;

use yofication::is_development;

pub struct ContinuousYoficationPages {
    // для каждого числа k от 0 до <максимальное число замен в страницах> найдём число страниц n, у которых строго больше чем k замен
    // чтобы в /randomPageName выбирать только из этих n страниц
    number_pages_with_number_replaces_more_than: Vec<usize>,
    all_pages: Vec<String>,
}

impl ContinuousYoficationPages {
    pub fn new() -> Self {
        // в файле хранятся строки — пары (число замен, имя страницы)
        // причём эти пары уже отсортированы по числу замен по убыванию
        let response = if is_development() {
            fs::read_to_string("temp/github-cache/frequencies/all-pages.txt").unwrap()
        } else {
            const ALL_PAGES_URL: &str = "https://raw.githubusercontent.com/dima74/Wikipedia-Yofication/frequencies/all-pages.txt";
            reqwest::get(ALL_PAGES_URL).unwrap().text().unwrap()
        };

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
            while let Some(page_number_replaces) = pages_number_replaces_iter.peek() {
                // todo while-let-chains https://github.com/rust-lang/rust/issues/53667
                if **page_number_replaces == number_replaces {
                    pages_number_replaces_iter.next();
                    current_number_pages -= 1;
                } else {
                    break;
                }
            }
            *number_pages = current_number_pages;
        }

        ContinuousYoficationPages { number_pages_with_number_replaces_more_than, all_pages }
    }

    pub fn get_random_page(&self, mut minimum_number_replaces: usize, maximum_number_replaces: Option<usize>) -> String {
        let maximum_possible_number_replaces = self.number_pages_with_number_replaces_more_than.len() - 1;
        minimum_number_replaces = min(max(minimum_number_replaces, 1), maximum_possible_number_replaces - 1);
        let end_index = self.number_pages_with_number_replaces_more_than[minimum_number_replaces - 1];
        let start_index = match maximum_number_replaces {
            None => 0,
            Some(x) if x >= maximum_possible_number_replaces => 0,
            Some(maximum_number_replaces) => min(end_index - 1, self.number_pages_with_number_replaces_more_than[maximum_number_replaces]),
        };
        let mut rng = rand::thread_rng();
        self.all_pages[start_index..end_index].choose(&mut rng).unwrap().to_owned()
    }
}
