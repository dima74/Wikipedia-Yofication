#![feature(proc_macro_hygiene, decl_macro)]

use std::error::Error;

use rocket::routes;

use yofication::lemmatization;
use yofication::yofication::Yofication;

use crate::continuous_yofication_pages::ContinuousYoficationPages;
use crate::words_pages::WordsPages;

mod routes;
mod continuous_yofication_pages;
mod cors;
mod mixpanel;
mod words_pages;

fn main() -> Result<(), Box<dyn Error>> {
    mixpanel::init();
    lemmatization::init();

    let routes = routes![
        routes::index,
        routes::static_files,
        routes::get_word_frequency,
        routes::yoficate::yoficate,
        routes::wiktionary::redirect_to_wiktionary_article,
        routes::wiktionary::wiktionary_article,
        routes::wikipedia::random_page_name,
        routes::wikipedia::get_word_page,
        routes::wikipedia::generate_replaces_by_wikitext,
        routes::wikipedia::generate_replaces_by_title,
        routes::gramota::redirect_to_gramota_ru_page,
    ];
    rocket::ignite()
        .attach(cors::CORS())
        .manage(ContinuousYoficationPages::new())
        .manage(Yofication::new()?)
        .manage(WordsPages::new())
        .mount("/", routes)
        .launch();
    Ok(())
}
