#![allow(dead_code)]
#![allow(unused_variables)]

use std::{env, fs, io};
use std::collections::HashSet;
use std::fs::File;
use std::io::{BufRead, BufReader};
use std::path::Path;

use percent_encoding::{AsciiSet, CONTROLS, utf8_percent_encode};

use yofication::{mediawiki, yoficate_titles};
use yofication::yoficate_titles::save_strings_to_file;

// нехорошие разработчики percent_encoding, почему они убрали удобный DEFAULT_ENCODE_SET (и define_encode_set)?
const CUSTOM_ENCODE_SET: &AsciiSet = &CONTROLS
    .add(b' ').add(b'"').add(b'#').add(b'<').add(b'>').add(b'`').add(b'?').add(b'{').add(b'}').add(b'(').add(b')');

fn initial_one_time_setup(api: &mediawiki::Api) {
    fs::create_dir_all("temp").unwrap();
    save_all_titles(api);
    save_excluded_articles(api);
}

fn save_excluded_articles(api: &mediawiki::Api) {
    let excluded_categories = include_str!("exclusions/ignored_categories.txt").lines();
    let excluded_articles = excluded_categories
        .flat_map(|category| api.get_all_category_pages(category));

    let file_name = "./temp/ruwiki-excluded_articles.txt";
    save_strings_to_file(excluded_articles, file_name).unwrap();
}

fn get_excluded_articles() -> HashSet<String> {
    let input = File::open("./temp/ruwiki-excluded_articles.txt").unwrap();
    BufReader::new(input).lines().map(|line| line.unwrap()).collect()
}

fn save_all_titles(api: &mediawiki::Api) {
    let all_titles = api.get_all_titles_non_redirects();
    let file_name = "./temp/ruwiki-all-titles-non-redirects.txt";
    save_strings_to_file(all_titles, file_name).unwrap();
}

fn get_titles_to_yoficate() -> Vec<(String, String, u8)> {
    let minimum_replace_frequency = 60;
    let all_titles_file = "./temp/ruwiki-all-titles-non-redirects.txt";
    let exclusions_path = "./src/various/wikipedia-yoficate-titles/";

    let excluded_titles = get_excluded_articles();
    let custom_titles_filter = |title: &str| !excluded_titles.contains(title);
    yoficate_titles::get_titles_to_yoficate(all_titles_file, exclusions_path, minimum_replace_frequency, custom_titles_filter)
}

fn print_titles_to_yoficate() {
    let titles = get_titles_to_yoficate();
    dbg!(titles.len());
    for (title, title_yoficated, frequency) in titles {
//        println!("{}", title);

//        println!("{:3} {}", frequency, title);
//        println!("{:120}{}", "", title_yoficated);

        println!("* [[{}]] → [[{}]]", title, title_yoficated);
    }
}

fn yoficate_titles_interactive(api: &mut mediawiki::Api, from_page: Option<&str>) {
    api.client_login("Дима74", &env::var("WIKIPEDIA_PASSWORD").unwrap());

    let titles = get_titles_to_yoficate();
    let titles = titles.iter().skip_while(|title| from_page.is_some() && title.0 != from_page.unwrap());
    for (title, title_yoficated, frequency) in titles {
        println!("\n{}, https://ru.wikipedia.org/wiki/{}", frequency, utf8_percent_encode(&title.replace(' ', "_"), CUSTOM_ENCODE_SET));
        println!("{}", title);
        println!("{}", title_yoficated);

        let mut line = String::new();
        io::stdin().lock().read_line(&mut line).unwrap();

        if line == "y\n" {
            api.rename_page(&title, &title_yoficated, "[[ВП:Ё]]");
        }
    }
}

fn main() {
    let api = mediawiki::Api::new("ru");

    if !Path::new("temp").exists() {
        initial_one_time_setup(&api);
        return;
    }

    print_titles_to_yoficate();
//    yoficate_titles_interactive(&mut api, None);
}
