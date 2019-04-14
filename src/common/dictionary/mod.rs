use std::collections::hash_map::Entry;
use std::collections::HashMap;
use std::error::Error;

pub use yoword_info::YowordInfo;

use crate::common::string16_utils;

pub mod hcodes;
pub mod wikipedia;
mod yoword_info;

pub fn get_ewords_map() -> Result<HashMap<Vec<u16>, YowordInfo>, Box<dyn Error>> {
    let mut ewords = HashMap::<Vec<u16>, YowordInfo>::new();

    let wikipedia_yoword_infos = wikipedia::fetch_wikipedia_yoword_infos();
    for yoword_info in wikipedia_yoword_infos {
        let eword: Vec<_> = string16_utils::deyoficate(&yoword_info.yoword.encode_utf16().collect::<Vec<_>>());
        ewords.insert(eword, yoword_info);
    }

    for is_safe in vec![true, false] {
        let yowords = hcodes::fetch_hcodes_yowords(is_safe)?;
        for yoword in yowords {
            let eword: Vec<_> = string16_utils::deyoficate(&yoword.encode_utf16().collect::<Vec<_>>());

            match ewords.entry(eword) {
                Entry::Occupied(entry) => entry.into_mut().is_safe = Some(is_safe),
                Entry::Vacant(entry) => {
                    let yoword_info = YowordInfo { yoword, number_with_yo: 0, number_all: 0, is_safe: Some(is_safe) };
                    entry.insert(yoword_info);
                }
            };
        }
    }

    Ok(ewords)
}

#[cfg(test)]
mod tests {
    use lazy_static::lazy_static;

    use super::*;

    lazy_static! {
        static ref EWORDS: HashMap<Vec<u16>, YowordInfo> = get_ewords_map().unwrap();
    }

    fn contains(eword: &str) -> bool {
        EWORDS.contains_key(&eword.encode_utf16().collect::<Vec<_>>())
    }

    fn test_contains(eword: &str) {
        assert!(contains(eword));
    }

    fn test_nocontains(eword: &str) {
        assert!(!contains(eword));
    }

    #[test]
    fn test() {
        test_contains("зеленый");
        test_contains("желтый");
        test_contains("ее");

        test_nocontains("красный");
        test_nocontains("привет");
    }

    #[test]
    fn test_frequency() {
        let eword = "ефицируясь".encode_utf16().collect::<Vec<_>>();
        let yoword = &EWORDS[&eword];
        assert_eq!(yoword.is_safe, Some(true));
        assert_eq!(yoword.frequency_wikipedia(), None);
        assert_eq!(yoword.frequency(), 39);
    }
}
