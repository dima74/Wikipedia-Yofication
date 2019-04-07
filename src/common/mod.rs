use std::env;

pub mod string_utils;
pub mod dictionary;
pub mod yofication;
pub mod mediawiki;
pub mod yoficate_titles;

pub fn is_development() -> bool {
    env::var("IS_DEVELOPMENT").is_ok()
}
