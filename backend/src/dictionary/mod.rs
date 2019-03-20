use std::cmp::max;
use std::collections::hash_map::Entry;
use std::collections::HashMap;
use std::error::Error;

use backend_common::hcodes;

use crate::string_utils;

pub mod wikipedia;

#[derive(Debug)]
pub struct YowordInfo {
    pub yoword: String,
    pub number_with_yo: u32,
    pub number_all: u32,
    pub is_safe: Option<bool>,
}

impl YowordInfo {
    pub fn frequency_wikipedia(&self) -> Option<u8> {
        if self.number_all == 0 {
            None
        } else {
            Some((self.number_with_yo * 100 / self.number_all) as u8)
        }
    }

    pub fn frequency(&self) -> u8 {
        let frequency_hcodes: u8 = match self.is_safe {
            None => 0,
            Some(is_safe) => if is_safe { 39 } else { 20 },
        };

        let frequency_wikipedia = self.frequency_wikipedia();
        match frequency_wikipedia {
            None => frequency_hcodes,
            Some(frequency_wikipedia) =>
                if frequency_wikipedia > 50 && self.is_safe == Some(true) {
                    100
                } else {
                    max(frequency_wikipedia, frequency_hcodes)
                }
        }
    }
}

pub fn get_ewords_map() -> Result<HashMap<Vec<u16>, YowordInfo>, Box<dyn Error>> {
    let mut ewords = HashMap::<Vec<u16>, YowordInfo>::new();

    let wikipedia_yoword_infos = wikipedia::fetch_wikipedia_yoword_infos()?;
    for yoword_info in wikipedia_yoword_infos {
        let eword: Vec<_> = string_utils::deyoficate(&yoword_info.yoword.encode_utf16().collect::<Vec<_>>());
        ewords.insert(eword, yoword_info);
    }

    for is_safe in vec![true, false] {
        let yowords = hcodes::fetch_hcodes_yowords(is_safe)?;
        for yoword in yowords {
            let eword: Vec<_> = string_utils::deyoficate(&yoword.encode_utf16().collect::<Vec<_>>());

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
