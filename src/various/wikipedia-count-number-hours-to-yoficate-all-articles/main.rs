#![allow(dead_code)]

use itertools::Itertools;
use std::cmp::Reverse;

fn count_number_hours_to_yoficate_the_whole_russian_wikipedia() {
    const ALL_PAGES_URL: &str = "https://raw.githubusercontent.com/dima74/Wikipedia-Yofication/frequencies/all-pages.txt";
    let response = reqwest::get(ALL_PAGES_URL).unwrap().text().unwrap();

    let mut number_seconds = 0;
    for line in response.lines() {
        let mut tokens = line.splitn(2, ' ');
        let number_replaces: u32 = tokens.next().unwrap().parse().unwrap();
//        let title = tokens.next().unwrap().to_string();
        if number_replaces > 10 {
            number_seconds += 60 + number_replaces * 7;
        }
    }
    eprintln!("number_hours = {:?}", number_seconds / 3600);
}

fn main() {
    let yowords = yofication::dictionary::wikipedia::fetch_wikipedia_yoword_infos();

    let yowords = yowords.iter()
        .filter(|yoword| yoword.frequency_wikipedia().map(|frequency| frequency > 90) == Some(true))
        .sorted_by_key(|yoword| Reverse(yoword.number_all))
        .take(100);
    for yoword in yowords {
        println!("{:3}  {:6}  {:6}  {}", yoword.frequency_wikipedia().unwrap(), yoword.number_all, yoword.number_all - yoword.number_with_yo, yoword.yoword);
    }
}
