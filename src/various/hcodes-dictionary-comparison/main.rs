#![allow(dead_code)]

use std::collections::HashSet;
use std::iter::FromIterator;

use yofication::dictionary::{self, YowordInfo};
use yofication::string_utils::deyoficate;

fn print_words(mut words: Vec<&String>) {
    words.sort();
    for word in words.iter() {
        println!("{}", word);
    }
    println!("\nlen: {}", words.len());
}

fn print_probably_not_safe(wikipedia_yowords: &[YowordInfo], hcodes_safe: &HashSet<String>) {
    let yowords = wikipedia_yowords.iter()
        .filter(|info| info.frequency() < 7 && info.number_all > 100)
        .map(|info| info.yoword.clone());
    let yowords: HashSet<String> = HashSet::from_iter(yowords);

    let words = hcodes_safe.iter()
        .filter(|word| yowords.contains(&deyoficate(&word))).collect();

//    let words: Vec<_> = yowords.intersection(&hcodes_safe).collect();
    print_words(words);
}

fn print_probably_missing_safe(wikipedia_yowords: &[YowordInfo], hcodes_safe: &HashSet<String>) {
    let yowords = wikipedia_yowords.iter()
        .filter(|info| info.yoword.chars().next().unwrap().is_lowercase() && info.number_with_yo > 100 && info.frequency() > 90)
        .map(|info| info.yoword.clone());
    let yowords: HashSet<String> = HashSet::from_iter(yowords);

    let words: Vec<_> = yowords.difference(&hcodes_safe).collect();
    print_words(words);
}

// todo
// 1. составить список всех слов, встречающихся в Википедии только с «е»
// 2. найти пересечение этого списка с deyoficate(hcodes.safe)
fn main() {
    let yoword_infos = dictionary::wikipedia::fetch_wikipedia_yoword_infos();
    let hcodes_safe = HashSet::from_iter(dictionary::hcodes::fetch_hcodes_yowords(true).unwrap());

//    print_probably_not_safe(&yoword_infos, &hcodes_safe);
    print_probably_missing_safe(&yoword_infos, &hcodes_safe);
}
