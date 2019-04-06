use std::cmp::Reverse;
use std::collections::HashSet;
use std::error::Error;
use std::fs;
use std::fs::File;
use std::io::{BufRead, BufReader, LineWriter, Write};

use lazy_static::lazy_static;
use regex::Regex;

use crate::Yofication;

lazy_static! { pub static ref YOFICATION: Yofication = Yofication::new().unwrap(); }

pub fn save_strings_to_file<T>(strings: T, file_name: &str) -> Result<(), Box<dyn Error>>
    where T: IntoIterator<Item=String>, {
    let file = File::create(file_name)?;
    let mut file = LineWriter::new(file);
    for string in strings {
        writeln!(file, "{}", string)?;
    }
    Ok(())
}

pub fn get_titles_to_yoficate<T: Fn(&str) -> bool>(all_titles_file: &str, exclusions_path: &str, minimum_replace_frequency: u8, custom_titles_filter: T) -> Vec<(String, String, u8)> {
    let ignored_titles_all = fs::read_to_string(exclusions_path.to_owned() + "ignored_titles.txt").unwrap();
    let ignored_titles: HashSet<&str> = ignored_titles_all.lines().collect();
    let ignored_regexes: Vec<Regex> = fs::read_to_string(exclusions_path.to_owned() + "ignored_yowords.txt").unwrap().lines()
        .map(|yoword| Regex::new(&format!("\\b{}\\b", yoword)).unwrap()).collect();

    let mut result = Vec::new();
    let file = File::open(all_titles_file).unwrap();
    for title in BufReader::new(file).lines() {
        let title = title.unwrap();
        let (title_yoficated, info) = YOFICATION.yoficate(&title, minimum_replace_frequency);
        if !info.has_replaces { continue; }

        let should_ignore = ignored_titles.contains(&title.as_str())
            || ignored_regexes.iter().any(|ignored_regex| ignored_regex.is_match(&title_yoficated));
        if should_ignore || !custom_titles_filter(&title) { continue; }

        result.push((title, title_yoficated, info.minimum_frequency));
    }
    result.sort_by_key(|entry| Reverse(entry.2));
    result
}
