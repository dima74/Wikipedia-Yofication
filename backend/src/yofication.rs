use std::char;
use std::collections::HashMap;
use std::error::Error;
use std::ops::Range;

use itertools::Itertools;
use serde::Serialize;

use backend::dictionary::{self, YowordInfo};
use backend::string_utils;

#[derive(Serialize, Debug)]
pub struct Replace {
    yoword: String,
    #[serde(rename = "yowordNormalized")]
    // без мягких переносов и ударений
    yoword_normalized: String,
    #[serde(rename = "wordStartIndex")]
    word_start_index: usize,
    frequency: u8,
    #[serde(rename = "frequencyWikipedia")]
    frequency_wikipedia: Option<u8>,
    #[serde(rename = "isSafe")]
    is_safe: Option<bool>,
}

pub struct Yofication {
    ewords: HashMap<Vec<u16>, YowordInfo>,
}

impl Yofication {
    pub fn new() -> Result<Yofication, Box<dyn Error>> {
        let ewords = dictionary::get_ewords_map()?;
        Ok(Yofication { ewords })
    }

    fn check_match(text: &Vec<u16>, eword: &Vec<u16>, range: Range<usize>) -> bool {
        let start = range.start;
        let end = range.end;

        fn u16_option_to_char(c: u16) -> char {
            char::from_u32(c as u32).unwrap_or('\u{0}')
        }
        let prev_char = if start > 0 { u16_option_to_char(text[start - 1]) } else { '\u{0}' };
        let next_char = if end < text.len() { u16_option_to_char(text[end]) } else { '\u{0}' };

        if prev_char.is_alphabetic() || next_char.is_alphabetic() { return false; }

        // слова вида [[воздух]]е
        if prev_char == ']' { return false; }

        if next_char == '.' && end - start <= 4 {
            // сокращения: нем.
            let ignored_shorted_word: Vec<u16> = "нем".encode_utf16().collect();
            if *eword == ignored_shorted_word { return false; }

            let is_this_word_last_in_sentence = end + 1 >= text.len() || u16_option_to_char(text[end + 1]).is_uppercase();
            if !is_this_word_last_in_sentence { return false; }
        }

        if Yofication::is_word_inside_tags(text, range) { return false; }

        true
    }

    fn is_word_inside_tags(text: &Vec<u16>, range: Range<usize>) -> bool {
        let tags: Vec<(Vec<u16>, Vec<u16>)> = vec![
            ("{{начало цитаты", "{{конец цитаты"),
            ("{{цитата", "}}"),
            ("{{quote box", "}}"),
            ("<blockquote", "</blockquote"),
            ("<ref", "</ref"),
            ("<poem", "</poem"),
        ].iter().map(|tag| (tag.0.encode_utf16().collect(), tag.1.encode_utf16().collect())).collect();

        for tag in tags.iter() {
            let tag_start = text[..range.start].windows(tag.0.len()).rposition(|window| tag.0 == window);
            if tag_start.is_none() { continue; }
            let tag_start = tag_start.unwrap();

            let tag_end = text[tag_start + tag.0.len()..].windows(tag.1.len()).position(|window| tag.1 == window);
            if tag_end.is_none() { continue; }
            let tag_end = tag_start + tag.0.len() + tag_end.unwrap();

            if range.start < tag_end {
                return true;
            }
        }
        false
    }

    fn normalize(word: &[u16]) -> Vec<u16> {
        word.iter().copied().filter(|&c| !string_utils::is_modifier(c)).collect()
    }

    fn get_original_yoword(yoword: &[u16], eword_original: &[u16]) -> Vec<u16> {
        // eword_original мог содержать модификаторы (ударения, мягкие переносы и т. д.)
        // в yoword их уже нет
        assert!(yoword.len() <= eword_original.len());

        let mut yoword_original = Vec::with_capacity(eword_original.len());
        let mut i = 0;
        for &c in eword_original.iter() {
            if string_utils::is_modifier(c) {
                yoword_original.push(c);
            } else {
                yoword_original.push(yoword[i]);
                i += 1;
            }
        }
        yoword_original
    }

    pub fn generate_replaces(self: &Self, text: &str, minimum_replace_frequency: u8) -> Vec<Replace> {
        let text: Vec<u16> = text.encode_utf16().collect();
        let ranges = string_utils::find_word_ranges(&text);

        let text_lowercase: Vec<u16> = text.iter().map(|&c| {
            if string_utils::is_russian_upper(c) { char::from_u32(c as u32).unwrap().to_lowercase().next().unwrap() as u16 } else { c }
        }).collect();

        // возвращает true если стоит попробовать замены для подчастей слова, то есть слово содержит дефис и
        // (его нет в словаре) или (по нему мало статистики и у него недостаточная частота)
        let create_replace = |replaces: &mut Vec<Replace>, range: Range<usize>| -> bool {
            let word_original = &text[range.start..range.end];
            let word = Yofication::normalize(word_original);
            // deyoficate нужен для поддержки ёфикации слов, содержащих ё
            let eword = string_utils::deyoficate(&word);

            let contains_hyphen = word_original.contains(&('-' as u16));

            let yoword_info = self.ewords.get(&eword);
            if yoword_info.is_none() { return contains_hyphen; }
            let yoword_info = yoword_info.unwrap();

            let yoword: Vec<_> = yoword_info.yoword.encode_utf16().collect();
            if yoword == word { return false; }

            if yoword_info.frequency() < minimum_replace_frequency
                && !(yoword_info.yoword == "Всё" && minimum_replace_frequency < 30) { return contains_hyphen; }

            if !Yofication::check_match(&text_lowercase, &eword, range.clone()) { return false; }

            if yoword_info.yoword.contains("гренадер") { return false; }

            let replace = Replace {
                yoword: String::from_utf16(&Yofication::get_original_yoword(&yoword, word_original)).unwrap(),
                yoword_normalized: yoword_info.yoword.to_owned(),
                word_start_index: range.start,
                frequency: yoword_info.frequency(),
                frequency_wikipedia: yoword_info.frequency_wikipedia(),
                is_safe: yoword_info.is_safe,
            };
            replaces.push(replace);
            false
        };

        let mut replaces = Vec::new();
        for range in ranges.into_iter() {
            let should_try_subwords = create_replace(&mut replaces, range.clone());
            if should_try_subwords {
                let word = &text[range.start..range.end];
                let mut part_bounds = vec![range.start];
                let hyphens_positions = word.iter()
                    .positions(|&c| c == '-' as u16)
                    .map(|i| range.start + i);
                part_bounds.extend(hyphens_positions);
                part_bounds.push(range.end);

                for (&start, &end) in part_bounds.iter().tuple_windows() {
                    let start = if start == range.start { start } else { start + 1 };
                    create_replace(&mut replaces, start..end);
                }
            }
        }
        replaces
    }

    pub fn yoficate(self: &Self, text: &str, minimum_replace_frequency: u8) -> (String, usize) {
        let replaces = self.generate_replaces(text, minimum_replace_frequency);
        let mut text: Vec<u16> = text.encode_utf16().collect();

        let number_replaces = replaces.len();
        for replace in replaces.into_iter() {
            let yoword: Vec<_> = replace.yoword.encode_utf16().collect();
            let start = replace.word_start_index;
            let end = start + yoword.len();
            text.splice(start..end, yoword);
        }

        (String::from_utf16(&text).unwrap(), number_replaces)
    }

    pub fn get_yoword_info<'a>(self: &'a Self, word: &str) -> Option<&'a YowordInfo> {
        let word: Vec<_> = word.encode_utf16().collect();
        let eword = string_utils::deyoficate(&word);
        self.ewords.get(&eword)
    }
}

#[cfg(test)]
mod tests;
