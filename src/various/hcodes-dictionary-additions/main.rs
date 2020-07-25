#![allow(unused_variables)]
#![allow(dead_code)]

use std::collections::HashSet;
use std::fs::File;
use std::io::{LineWriter, Write};
use std::iter::FromIterator;

use itertools::Itertools;

use yofication::dictionary;
use yofication::dictionary::YowordInfo;

// нужно для удобного создания дополнений (чтобы можно было сразу все формы слова взять)
fn save_all_yowords(wikipedia_yowords: &[YowordInfo]) {
    let file = File::create("./src/various/hcodes-dictionary-additions/all_yowords.txt").unwrap();
    let mut file = LineWriter::new(file);
    for yoword in wikipedia_yowords {
        writeln!(file, "{}", yoword.yoword).unwrap();
    }
}

fn create_additions(wikipedia_yowords: &[YowordInfo], hcodes_safe: &HashSet<String>, hcodes_not_safe: &HashSet<String>) {
    let hcodes_additions = wikipedia_yowords.iter()
        .filter(|yoword| !hcodes_safe.contains(&yoword.yoword) && !hcodes_not_safe.contains(&yoword.yoword))
        .filter(|yoword| yoword.yoword.chars().next().unwrap().is_lowercase())
        .filter(|yoword| !yoword.yoword.contains('-'))
        .filter(|yoword| yoword.number_all > 100 && yoword.frequency() > 90)
        .sorted_by(|yoword1, yoword2| yoword1.yoword.cmp(&yoword2.yoword));

    let file = File::create("./src/various/hcodes-dictionary-additions/possible_additions100.txt").unwrap();
    let mut file = LineWriter::new(file);
    for yoword in hcodes_additions {
        writeln!(file, "{}", yoword.yoword).unwrap();
    }
}

fn main() {
    let yoword_infos = dictionary::wikipedia::fetch_wikipedia_yoword_infos();
    let hcodes_safe = dictionary::hcodes::fetch_hcodes_yowords(true).unwrap();
    let hcodes_safe = HashSet::from_iter(dictionary::hcodes::fetch_hcodes_yowords(true).unwrap());
    let hcodes_not_safe = HashSet::from_iter(dictionary::hcodes::fetch_hcodes_yowords(false).unwrap());

//    save_all_yowords(&yoword_infos);
    create_additions(&yoword_infos, &hcodes_safe, &hcodes_not_safe);
}
