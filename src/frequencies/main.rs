use std::error::Error;

use yofication::is_development;
use yofication::yofication::Yofication;

use crate::frequencies_generator::FrequenciesGenerator;
use crate::pages_generator::PagesGenerator;
use crate::string_utils::find_words;
use crate::words_pages_generator::WordsPagesGenerator;

mod wikipedia_dump;
mod string_utils;
mod frequencies_generator;
mod pages_generator;
mod words_pages_generator;

fn main() -> Result<(), Box<dyn Error>> {
    let yofication = Yofication::new()?;

    let mut frequencies_generator = FrequenciesGenerator::new(&yofication)?;
    let mut pages_generator = PagesGenerator::new(&yofication);
    let mut words_pages_generator = WordsPagesGenerator::new(&yofication);

    let consumer = |title: String, text: String| {
        let words = find_words(text);
        frequencies_generator.parse(&words);
        pages_generator.parse(title.clone(), &words);
        words_pages_generator.parse(title, &words);
    };
    let number_articles = if is_development() { 100 } else { std::u32::MAX };
    wikipedia_dump::iterate_articles(consumer, number_articles)?;

    frequencies_generator.save_result("./results/frequencies.txt");
    pages_generator.save_result("./results/all-pages.txt");
    words_pages_generator.save_result("./results/pages-for-words-with-few-replaces.json");
    Ok(())
}
