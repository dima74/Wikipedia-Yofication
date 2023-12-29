use std::collections::hash_map::Entry;
use std::collections::HashMap;
use std::error::Error;
use std::ops::Deref;
use lazy_static::lazy_static;
use slice_arena::SliceArena;

pub use yoword_info::YowordInfo;

use crate::common::string16_utils;

pub mod hcodes;
pub mod wikipedia;
mod yoword_info;

lazy_static! { pub static ref ARENA16: SliceArena<u16> = SliceArena::new(); }

pub fn get_ewords_map() -> Result<HashMap<&'static [u16], YowordInfo>, Box<dyn Error>> {
    let arena16 = &ARENA16;
    let mut ewords = HashMap::<&[u16], YowordInfo>::new();

    let wikipedia_yoword_infos = wikipedia::fetch_wikipedia_yoword_infos();
    for yoword_info in wikipedia_yoword_infos {
        let eword: Vec<_> = string16_utils::deyoficate(&yoword_info.yoword.encode_utf16().collect::<Vec<_>>());
        let eword = arena16.push(&eword);
        ewords.insert(eword, yoword_info);
    }

    for &is_safe in &[true, false] {
        let yowords = hcodes::fetch_hcodes_yowords(is_safe)?;
        for yoword in yowords {
            let eword: Vec<_> = string16_utils::deyoficate(&yoword.encode_utf16().collect::<Vec<_>>());
            match ewords.get_mut(eword.deref()) {
                Some(entry) => {
                    entry.is_safe = Some(is_safe);
                }
                None => {
                    let eword = arena16.push(&eword);
                    let yoword_info = YowordInfo { yoword, number_with_yo: 0, number_all: 0, is_safe: Some(is_safe) };
                    ewords.insert(eword, yoword_info);
                }
            }
        }
    }

    dbg!(ewords.len());
    dbg!(ewords.values().filter(|e| e.frequency() <= 10).count());
    dbg!(ewords.values().filter(|e| e.frequency() <= 15).count());
    dbg!(ewords.values().filter(|e| e.frequency() <= 20).count());

    // dbg!(ewords.len());
    // dbg!(ewords.iter().map(|(s, _)| s.len()).sum::<usize>());
    //
    // let arenas = arena16.arenas.lock().unwrap();
    // dbg!(arenas.len());
    // for arena in arenas.iter() {
    //     dbg!(arena.len());
    // }

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
    fn test_safe() {
        let eword = "зеленый".encode_utf16().collect::<Vec<_>>();
        let yoword = &EWORDS[&eword];
        assert_eq!(yoword.is_safe, Some(true));
        assert!(yoword.frequency_wikipedia().is_some());
    }

    #[test]
    fn test_not_safe() {
        let eword = "все".encode_utf16().collect::<Vec<_>>();
        let yoword = &EWORDS[&eword];
        assert_eq!(yoword.is_safe, Some(false));
        assert!(yoword.frequency_wikipedia().is_some());
    }

    #[test]
    fn test_frequency() {
        let eword = "ефицируясь".encode_utf16().collect::<Vec<_>>();
        let yoword = &EWORDS[&eword];
        assert_eq!(yoword.is_safe, Some(true));
        assert_eq!(yoword.frequency_wikipedia(), None);
        // 39 это специальная частота для слов из safe словаря hcodes не встречающихся в Википедии
        assert_eq!(yoword.frequency(), 39);
    }
}
