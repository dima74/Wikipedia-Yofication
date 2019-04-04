use std::error::Error;

use crate::frequencies_generator::FrequenciesGenerator;
use crate::pages_generator::PagesGenerator;
use crate::string_utils::find_words;
use crate::yoword_info::YowordInfo;

mod wikipedia_dump;
mod yoword_info;
mod string_utils;
mod frequencies_generator;
mod pages_generator;

fn get_old_yoword_infos() -> Result<Vec<YowordInfo>, Box<dyn Error>> {
    const FREQUENCIES_URL: &str = "https://raw.githubusercontent.com/dima74/Wikipedia-Yofication/frequencies/frequencies.txt";
    let response = reqwest::get(FREQUENCIES_URL)?.text()?;

    let mut yowords = Vec::new();
    for line in response.lines() {
        let mut tokens = line.split_whitespace();
        let yoword = tokens.next().unwrap().to_string();
        let number_with_yo = tokens.next().unwrap().parse()?;
        let number_all = tokens.next().unwrap().parse()?;
        yowords.push(YowordInfo { yoword, number_with_yo, number_all });
    }
    Ok(yowords)
}

fn main() -> Result<(), Box<dyn Error>> {
    let old_yoword_infos = get_old_yoword_infos()?;

    let mut frequencies_generator = FrequenciesGenerator::new(&old_yoword_infos)?;
    let mut pages_generator = PagesGenerator::new(&old_yoword_infos);

    let consumer = |title: String, text: String| {
        let words = find_words(text);
        frequencies_generator.parse(&words);
        pages_generator.parse(title, &words);
    };
    let number_articles = if cfg!(debug_assertions) { 100 } else { std::u32::MAX };
    crate::wikipedia_dump::iterate_articles(consumer, number_articles)?;

    frequencies_generator.save_result("./results/frequencies.txt");
    pages_generator.save_result("./results/all-pages.txt");
    Ok(())
}
