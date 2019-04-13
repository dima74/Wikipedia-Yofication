use std::fs;

use crate::is_development;
use crate::dictionary::YowordInfo;

pub fn fetch_wikipedia_yoword_infos() -> Vec<YowordInfo> {
    let response = if is_development() {
        fs::read_to_string("temp/github-cache/frequencies/frequencies.txt").unwrap()
    } else {
        const FREQUENCIES_URL: &str = "https://raw.githubusercontent.com/dima74/Wikipedia-Yofication/frequencies/frequencies.txt";
        reqwest::get(FREQUENCIES_URL).unwrap().text().unwrap()
    };

    let mut yowords = Vec::new();
    for line in response.lines() {
        let mut tokens = line.split_whitespace();
        let yoword = tokens.next().unwrap().to_string();
        let number_with_yo = tokens.next().unwrap().parse().unwrap();
        let number_all = tokens.next().unwrap().parse().unwrap();
        yowords.push(YowordInfo { yoword, number_with_yo, number_all, is_safe: None });
    }
    yowords
}
