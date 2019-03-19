use std::error::Error;

use super::YowordInfo;

pub fn fetch_wikipedia_yoword_infos() -> Result<Vec<YowordInfo>, Box<dyn Error>> {
    const FREQUENCIES_URL: &str = "https://raw.githubusercontent.com/dima74/Wikipedia-Yofication/frequencies/frequencies.txt";
    let response = reqwest::get(FREQUENCIES_URL)?.text()?;

    let mut yowords = Vec::new();
    for line in response.lines() {
        let mut tokens = line.split_whitespace();
        let yoword = tokens.next().unwrap().to_string();
        let number_with_yo = tokens.next().unwrap().parse()?;
        let number_all = tokens.next().unwrap().parse()?;
        yowords.push(YowordInfo { yoword, number_with_yo, number_all, is_safe: None });
    }
    Ok(yowords)
}
