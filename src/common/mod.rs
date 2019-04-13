use std::env;

pub mod string_utils;
pub mod dictionary;
pub mod yofication;
pub mod lemmatization;
pub mod mediawiki;
pub mod yoficate_titles;
pub mod words_pages_generator;
pub mod lowercase_first_string;

pub fn is_development() -> bool {
    env::var("IS_DEVELOPMENT").is_ok()
}
