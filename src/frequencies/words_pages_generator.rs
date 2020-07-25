use std::collections::btree_map::BTreeMap;
use std::collections::HashMap;
use std::fs;

use yofication::lowercase_first_string::LowercaseFirstString;
use yofication::string_utils::deyoficate;
use yofication::words_pages_generator::get_yoword_number_pages;
use yofication::yofication::Yofication;

pub struct WordsPagesGenerator {
    words_pages: HashMap<String, Vec<String>>,
}

impl WordsPagesGenerator {
    pub fn new(yofication: &Yofication) -> Self {
        let words_pages: HashMap<_, _> = yofication.iter_yowords()
            .filter_map(|yoword| {
                let (to_yoficate, yoword_number_pages) = get_yoword_number_pages(yoword);
                if 0 < yoword_number_pages && yoword_number_pages < 10 {
                    let word = if to_yoficate { deyoficate(&yoword.yoword) } else { yoword.yoword.clone() };
                    Some((word, Vec::with_capacity(yoword_number_pages as usize)))
                } else {
                    None
                }
            }).collect();
        Self { words_pages }
    }

    pub fn parse(&mut self, title: String, words: &[String]) {
        for word in words {
            if let Some(eword_pages) = self.words_pages.get_mut(word) {
                if eword_pages.last() != Some(&title) {
                    eword_pages.push(title.clone());
                }
            }
        }
    }

    pub fn save_result(self, file_name: &str) {
        let ewords_pages: BTreeMap<LowercaseFirstString, Vec<String>> = self.words_pages.into_iter()
            .filter(|(_, pages)| !pages.is_empty())
            .map(|(word, pages)| (LowercaseFirstString(word), pages))
            .collect();

        let contents = serde_json::to_string_pretty(&ewords_pages).unwrap();
        fs::write(file_name, contents).unwrap();
    }
}
