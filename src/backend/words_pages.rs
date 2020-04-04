use std::collections::HashMap;
use std::fs;

use yofication::is_development;
use yofication::string_utils::deyoficate;

pub struct WordsPages {
    ewords_pages: HashMap<String, Vec<String>>,
}

impl WordsPages {
    pub fn new() -> Self {
        let response = if is_development() {
            fs::read_to_string("temp/github-cache/frequencies/pages-for-words-with-few-replaces.json").unwrap()
        } else {
            const WORDS_PAGES_URL: &str = "https://raw.githubusercontent.com/dima74/Wikipedia-Yofication/frequencies/pages-for-words-with-few-replaces.json";
            reqwest::blocking::get(WORDS_PAGES_URL).unwrap().text().unwrap()
        };

        let words_pages: HashMap<String, Vec<String>> = serde_json::from_str(&response).unwrap();
        let ewords_pages = words_pages.into_iter()
            .map(|(word, pages)| (deyoficate(&word), pages))
            .collect();
        Self { ewords_pages }
    }

    pub fn get_word_page(&self, word: &str, page_index: usize) -> Option<String> {
        let eword = deyoficate(word);
        self.ewords_pages.get(&eword)
            .and_then(|pages| pages.get(page_index).map(ToOwned::to_owned))
    }
}
