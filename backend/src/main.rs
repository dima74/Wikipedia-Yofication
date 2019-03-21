#![feature(proc_macro_hygiene, decl_macro, iter_copied, inner_deref)]

use std::error::Error;

use rocket::routes;

use crate::continuous_yofication_pages::ContinuousYoficationPages;
use crate::yofication::Yofication;

mod continuous_yofication_pages;
mod yofication;
mod routes;
mod cors;
mod mixpanel;

fn main() -> Result<(), Box<dyn Error>> {
    mixpanel::init();

    let routes = routes![
        routes::index,
        routes::static_files,
        routes::get_word_frequency,
        routes::yoficate::yoficate,
        routes::wiktionary::redirect_to_wiktionary_article,
        routes::wiktionary::wiktionary_article,
        routes::wikipedia::random_page_name,
        routes::wikipedia::generate_replaces_by_wikitext,
        routes::wikipedia::generate_replaces_by_title,
    ];
    rocket::ignite()
        .attach(cors::CORS())
        .manage(ContinuousYoficationPages::new())
        .manage(Yofication::new()?)
        .mount("/", routes)
        .launch();
    Ok(())
}
