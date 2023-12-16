use std::error::Error;
use std::fs;

use regex::Regex;

use crate::is_development;

pub fn fetch_hcodes_yowords(is_safe: bool) -> Result<Vec<String>, Box<dyn Error>> {
    let file_name = if is_safe { "safe.txt" } else { "not_safe.txt" };
    let response = if is_development() {
        fs::read_to_string(format!("temp/github-cache/dictionary/{}", file_name))?
    } else {
        let url = format!("https://raw.githubusercontent.com/dima74/eyo-kernel/master/dictionary/{}", file_name);
        reqwest::blocking::get(&url)?.text()?
    };
    assert_ne!(response, "404: Not Found");

    let re_comment = Regex::new(" *#.*").unwrap();
    let re_base_and_suffixes = Regex::new(r"^([^(|)]+)\(([^()]+)\)$").unwrap();

    let mut result = Vec::new();
    for line in response.lines() {
        let line = re_comment.replace(line, "");

        if !line.contains('(') {
            result.push(line.into_owned());
            continue;
        }

        let captures = re_base_and_suffixes.captures(&line).ok_or("failed to parse dictionary entry")?;
        let base = &captures[1];
        let suffixes = &captures[2];
        for suffix in suffixes.split('|') {
            result.push(base.to_owned() + suffix);
        }
    }
    Ok(result)
}
