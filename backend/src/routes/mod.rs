use std::io;

use rocket::{get, State};
use rocket::response::NamedFile;

use crate::yofication::Yofication;

pub mod yoficate;
pub mod wikipedia;
pub mod wiktionary;

#[get("/")]
pub fn index() -> io::Result<NamedFile> {
    NamedFile::open("static/index.html")
}

#[get("/stat/<word>")]
pub fn get_word_frequency(word: String, yofication: State<Yofication>) -> String {
    match yofication.get_yoword_info(&word) {
        None => "Нет информации о слове".to_owned(),
        Some(yoword) => {
            let frequency = yoword.frequency_wikipedia().map_or("?".to_owned(), |frequency| format!("{}%", frequency));
            let is_safe = match yoword.is_safe {
                Some(true) => "yes",
                Some(false) => "no",
                None => "unknown",
            };
            format!("\n\n
частота: {}
is_safe: {}


общее число вхождений: {:7}
число вхождений с ё:   {:7}",
                    frequency, is_safe, yoword.number_all, yoword.number_with_yo)
        }
    }
}
