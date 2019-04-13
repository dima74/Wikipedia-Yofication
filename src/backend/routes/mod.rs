use std::io;
use std::path::{Path, PathBuf};

use rocket::{get, Request, response, Response, State};
use rocket::response::{NamedFile, Responder};

use yofication::yofication::Yofication;

pub mod yoficate;
pub mod wikipedia;
pub mod wiktionary;
pub mod gramota;

#[get("/")]
pub fn index() -> io::Result<NamedFile> {
    NamedFile::open("backend-static/index.html")
}

// https://github.com/SergioBenitez/Rocket/issues/95#issuecomment-354824883
pub struct CachedFile(NamedFile);

impl<'r> Responder<'r> for CachedFile {
    fn respond_to(self, req: &Request) -> response::Result<'r> {
        Response::build_from(self.0.respond_to(req)?)
            .raw_header("Cache-Control", "max-age=2592000")  // 1 month (30*24*60*60)
            .ok()
    }
}

#[get("/static/<file..>")]
pub fn static_files(file: PathBuf) -> Option<CachedFile> {
    NamedFile::open(Path::new("backend-static/").join(file)).ok().map(|nf| CachedFile(nf))
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
            format!("
{}


частота: {}
is_safe: {}


общее число вхождений: {:7}
число вхождений с ё:   {:7}",
                    yoword.yoword, frequency, is_safe, yoword.number_all, yoword.number_with_yo)
        }
    }
}
