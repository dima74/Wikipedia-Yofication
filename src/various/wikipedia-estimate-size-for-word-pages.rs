use yofication::dictionary;
use yofication::words_pages_generator::get_yoword_number_pages;

fn main() {
    let yowords = dictionary::wikipedia::fetch_wikipedia_yoword_infos();

    let yowords_number_pages: Vec<_> = yowords.iter()
        .map(|yoword| get_yoword_number_pages(yoword).1)
        .filter(|&number_pages| 0 < number_pages && number_pages < 10)
        .collect();
    let number_pages: u32 = yowords_number_pages.iter().sum();
    println!("number yowords:  {}", yowords_number_pages.len());
    println!("number pages:    {}", number_pages);
}
