use std::collections::HashMap;
use std::fs::File;
use std::io::{LineWriter, Write};

use crate::string_utils::*;
use crate::yoword_info::YowordInfo;

struct EwordInfo {
    number_all: u32,
    yoword_counts: HashMap<String, u32>,
}

impl EwordInfo {
    fn get_best_yword_info(self) -> YowordInfo {
        let best_entry = self.yoword_counts.into_iter().max_by_key(|entry| entry.1).unwrap();
        YowordInfo { yoword: best_entry.0, number_with_yo: best_entry.1, number_all: self.number_all }
    }
}

pub struct FrequenciesGenerator {
    eword_infos: HashMap<String, EwordInfo>,
}

impl FrequenciesGenerator {
    // todo также использовать safe & non_safe слова словаря hcodes чтобы по всем ним статистика тоже собиралась
    pub fn new(old_yoword_infos: &Vec<YowordInfo>) -> FrequenciesGenerator {
        let eword_infos = old_yoword_infos.iter()
            .map(|yoword| (deyoficate(&yoword.yoword), EwordInfo { number_all: 0, yoword_counts: HashMap::new() }))
            .collect();

        FrequenciesGenerator { eword_infos }
    }

    pub fn parse(&mut self, words: &Vec<String>) {
        for word in words.iter() {
            let contains_yo = word.contains('ё') || word.contains('Ё');
            if contains_yo {
                let eword = deyoficate(word);
                let mut eword_info = self.eword_infos.entry(eword)
                    .or_insert_with(|| EwordInfo { number_all: 0, yoword_counts: HashMap::new() });
                *eword_info.yoword_counts.entry(word.clone()).or_insert(0) += 1;
                eword_info.number_all += 1;
            } else {
                if let Some(eword_info) = self.eword_infos.get_mut(word) {
                    eword_info.number_all += 1;
                }
            }
        }
    }

    pub fn save_result(self, file_name: &str) {
        let mut yowords: Vec<_> = self.eword_infos.into_iter()
            .filter(|entry| !entry.1.yoword_counts.is_empty())
            .map(|entry| entry.1.get_best_yword_info()).collect();
        yowords.sort_by(|yoword1, yoword2| yoword1.cmp(&yoword2));

        let file = File::create(file_name).unwrap();
        let mut file = LineWriter::new(file);
        for yoword in yowords.iter() {
            writeln!(file, "{} {} {}", yoword.yoword, yoword.number_with_yo, yoword.number_all).unwrap();
        }
    }
}
