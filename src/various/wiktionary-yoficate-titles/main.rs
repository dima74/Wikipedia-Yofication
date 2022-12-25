#![allow(dead_code)]

use std::{env, thread};
use std::collections::HashSet;
use std::iter::FromIterator;
use std::time::Duration;

use yofication::{mediawiki, yoficate_titles};
use yofication::yoficate_titles::{save_strings_to_file, YOFICATION};

fn save_russian_words(api: &mediawiki::Api) {
    let mut russian_words: HashSet<String> = HashSet::from_iter(api.get_all_category_pages("Категория:Русский язык"));

    let language_categories = api.get_all_category_subcategories("Категория:Алфавитный список языков");
    let non_russian_words = language_categories.iter()
        .filter(|&category| category != "Категория:Русский язык")
        .flat_map(|category| api.get_all_category_pages(category));
    for non_russian_word in non_russian_words {
        russian_words.remove(&non_russian_word);
    }

    for redirect in api.get_all_titles_redirects() {
        russian_words.remove(&redirect);
    }

    let file_name = "./temp/ruwiktionary-russian-words-non-redirects.txt";
    save_strings_to_file(russian_words, file_name).unwrap();
}

fn get_titles_to_yoficate() -> Vec<(String, String, u8)> {
    let minimum_replace_frequency = 50;
    let all_titles_file = "./temp/ruwiktionary-russian-words-non-redirects.txt";
    let exclusions_path = "./src/various/wiktionary-yoficate-titles/exclusions/";
    let custom_titles_filter = |title: &str| title.chars().next().unwrap().is_lowercase();
    yoficate_titles::get_titles_to_yoficate(all_titles_file, exclusions_path, minimum_replace_frequency, custom_titles_filter)
}

fn print_titles_to_yoficate() {
    let titles = get_titles_to_yoficate();
    dbg!(titles.len());
    for (title, title_yoficated, minimum_frequency) in titles {
        let title = title.replace(' ', "_");
        let links = format!("[http://gramota.ru/slovari/dic/?word={0}&all=x gramota], [https://yofication-diralik.amvera.io/stat/{0} stat]", title);
        println!("* {3:3}  ([[Обсуждение:{0}|обс0]], [[Обсуждение:{1}|обс1]])  {0} [[{0}]] → [[{1}]]  ({2})", title, title_yoficated, links, minimum_frequency);
    }
}

fn print_wikitext_for_obvious_titles() {
    for title in include_str!("./results/articles-to-rename_obvious.txt").lines() {
        let (title_yoficated, _) = YOFICATION.yoficate(title, 50);
        let title = title.replace(' ', "_");
        let links = format!("[http://gramota.ru/slovari/dic/?word={0}&all=x gramota], [https://yofication-diralik.amvera.io/stat/{0} stat]", title);
        println!("* [[Обсуждение:{0}|(обс)]]  [[{0}]] → [[{1}]]  ({2})", title, title_yoficated, links);
    }
}

fn print_wikitext_for_delete_request() {
    for title in include_str!("./results/articles-to-redirect.txt").lines() {
        let (title_yoficated, _) = YOFICATION.yoficate(title, 50);
        let links = format!("[http://gramota.ru/slovari/dic/?word={0}&all=x gramota]", title);
        println!("* [[{}]] → [[{}]]  ({})", title, title_yoficated, links);
    }
}

fn rename_articles(mut api: mediawiki::Api) {
    api.client_login("Дима74", &env::var("WIKIPEDIA_PASSWORD").unwrap());
    for title in include_str!("./results/articles-to-rename_obvious.txt").lines() {
        let (title_yoficated, _) = YOFICATION.yoficate(title, 50);
        println!("{} → {}", title, title_yoficated);
        api.rename_page(title, &title_yoficated, "gramota.ru");
        thread::sleep(Duration::from_secs(5));
    }
}

fn main() {
//    let api = mediawiki::Api::new("https://ru.wiktionary.org/w/api.php");
//    save_russian_words(&api);

    print_titles_to_yoficate();
//    print_wikitext_for_obvious_titles();
//    print_wikitext_for_delete_request();
//    rename_articles(api);
}
