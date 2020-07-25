use std::cmp::Ordering;
use std::collections::HashMap;
use std::error::Error;
use std::fs::File;
use std::io::{LineWriter, Write};

use yofication::dictionary::{hcodes, YowordInfo};
use yofication::string_utils::deyoficate;
use yofication::yofication::Yofication;

struct EwordInfo {
    number_all: u32,
    yoword_counts: HashMap<String, u32>,
}

impl EwordInfo {
    fn new() -> EwordInfo {
        EwordInfo { number_all: 0, yoword_counts: HashMap::new() }
    }
}

pub struct FrequenciesGenerator {
    eword_infos: HashMap<String, EwordInfo>,
}

impl FrequenciesGenerator {
    pub fn new(yofication: &Yofication) -> Result<FrequenciesGenerator, Box<dyn Error>> {
        let mut all_yowords = Vec::new();

        let wikipedia_yowords = yofication.iter_yowords()
            .filter(|yoword| yoword.number_with_yo > 0)
            .map(|yoword| yoword.yoword.to_owned());
        all_yowords.extend(wikipedia_yowords);

        for &is_safe in &[true, false] {
            let mut hcodes_yowords = hcodes::fetch_hcodes_yowords(is_safe)?;
            all_yowords.append(&mut hcodes_yowords);
        }

        let eword_infos = all_yowords.iter()
            .map(|yoword| (deyoficate(&yoword), EwordInfo::new()))
            .collect();

        Ok(FrequenciesGenerator { eword_infos })
    }

    pub fn parse(&mut self, words: &[String]) {
        for word in words.iter() {
            let contains_yo = word.contains('ё') || word.contains('Ё');
            if contains_yo {
                let eword = deyoficate(word);
                let mut eword_info = self.eword_infos.entry(eword)
                    .or_insert_with(EwordInfo::new);
                *eword_info.yoword_counts.entry(word.clone()).or_insert(0) += 1;
                eword_info.number_all += 1;
            } else {
                if let Some(eword_info) = self.eword_infos.get_mut(word) {
                    eword_info.number_all += 1;
                } else if word.contains('-') {
                    let mut eword_info = EwordInfo::new();
                    eword_info.number_all += 1;
                    self.eword_infos.insert(word.to_owned(), eword_info);
                }
            }
        }
    }

    pub fn compare_lowercase_first(yoword1: &YowordInfo, yoword2: &YowordInfo) -> Ordering {
        fn get_sort_tuple(yoword: &YowordInfo) -> (bool, bool, &str) {
            (yoword.number_with_yo == 0, yoword.yoword.chars().next().unwrap().is_uppercase(), &yoword.yoword)
        }

        get_sort_tuple(yoword1).cmp(&get_sort_tuple(yoword2))
    }

    pub fn save_result(self, file_name: &str) {
        fn get_best_yword_info(entry: (String, EwordInfo)) -> YowordInfo {
            let (eword, eword_info) = entry;
            let (best_yoword_count, best_yoword) = eword_info.yoword_counts.into_iter()
                .map(|(yoword, count)| (count, yoword))
                .max()
                .unwrap_or((0, eword));
            YowordInfo { yoword: best_yoword, number_with_yo: best_yoword_count, number_all: eword_info.number_all, is_safe: None }
        }

        let mut yowords: Vec<_> = self.eword_infos.into_iter()
            .filter(|entry| entry.1.number_all > 0)
            .map(get_best_yword_info).collect();
        yowords.sort_by(FrequenciesGenerator::compare_lowercase_first);

        let file = File::create(file_name).unwrap();
        let mut file = LineWriter::new(file);
        for yoword in yowords.iter() {
            writeln!(file, "{} {} {}", yoword.yoword, yoword.number_with_yo, yoword.number_all).unwrap();
        }
    }
}
