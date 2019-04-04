#![allow(dead_code)]
#![allow(unused_variables)]
#![allow(unreachable_code)]

use std::{env, fs, io};
use std::cmp::Reverse;
use std::collections::HashSet;
use std::fs::File;
use std::io::{BufRead, BufReader, LineWriter, Write};
use std::path::Path;

use lazy_static::lazy_static;
use regex::Regex;
use reqwest::{Client, header};
use url::percent_encoding::{DEFAULT_ENCODE_SET, define_encode_set, utf8_percent_encode};

use session::Session;
use yofication::Yofication;

mod session;

define_encode_set! { pub CUSTOM_ENCODE_SET = [DEFAULT_ENCODE_SET] | {'(', ')'} }

lazy_static! { static ref YOFICATION: Yofication = Yofication::new().unwrap(); }

fn initial_one_time_setup() {
    fs::create_dir_all("temp").unwrap();
    save_all_titles();
    save_excluded_articles();
}

fn iterate_all<T: FnMut(serde_json::Value) -> ()>(request_continue: &str, response_continue: &str, params: &[(&str, &str)], mut consumer: T) {
    let mut from_page = "".to_owned();
    loop {
        let mut response = Client::new()
            .get("https://ru.wikipedia.org/w/api.php")
            .query(params)
            .query(&[(request_continue, &from_page)])
            .send().unwrap();
        let response: serde_json::Value = response.json().unwrap();
        let continue_page = response.get("continue")
            .map(|v| v[response_continue].as_str().unwrap().to_owned());

        consumer(response);

        match continue_page {
            None => break,
            Some(continue_page) => { from_page = continue_page }
        }
    }
}

fn get_all_category_pages(category: &str) -> Vec<String> {
    let mut all_titles = Vec::new();

    let params = [
        ("format", "json"),
        ("formatversion", "2"),
        ("action", "query"),
        ("list", "categorymembers"),
        ("cmtitle", category),
        ("cmnamespace", "0"),
        ("cmlimit", "5000"),
    ];
    iterate_all("cmcontinue", "cmcontinue", &params, |response| {
        let titles = response["query"]["categorymembers"].as_array().unwrap()
            .iter().map(|o| o["title"].as_str().unwrap().to_owned());
        all_titles.extend(titles);
    });
    all_titles
}

fn get_all_titles() -> Vec<String> {
    let mut all_titles = Vec::with_capacity(1_700_000);

    let params = [
        ("format", "json"),
        ("formatversion", "2"),
        ("action", "query"),
        ("list", "allpages"),
        ("apfilterredir", "nonredirects"),
        ("aplimit", "5000"),
    ];
    iterate_all("apfrom", "apcontinue", &params, |response| {
        let titles = response["query"]["allpages"].as_array().unwrap()
            .iter().map(|o| o["title"].as_str().unwrap().to_owned());
        all_titles.extend(titles);
    });
    all_titles
}

fn save_strings_to_file(strings: Vec<String>, file_name: &str) {
    let file = File::create(file_name).unwrap();
    let mut file = LineWriter::new(file);
    for string in strings {
        writeln!(file, "{}", string).unwrap();
    }
}

fn save_all_titles() {
    let all_titles = get_all_titles();
    let file_name = "./temp/ruwiki-all-titles-non-redirects.txt";
    save_strings_to_file(all_titles, file_name);
}

fn save_excluded_articles() {
    let excluded_categories = include_str!("exclusions/ignored_categories.txt").lines();
    let excluded_articles = excluded_categories
        .flat_map(|category| get_all_category_pages(category))
        .collect();

    let file_name = "./temp/ruwiki-excluded_articles.txt";
    save_strings_to_file(excluded_articles, file_name);
}

fn get_titles_to_yoficate() -> Vec<(String, String, u8)> {
    let excluded_articles = get_excluded_articles();
    let ignored_regexes: Vec<Regex> = include_str!("exclusions/ignored_yowords.txt").lines()
        .map(|yoword| Regex::new(&format!("\\b{}\\b", yoword)).unwrap()).collect();
    let ignored_pages: Vec<&str> = include_str!("exclusions/ignored_titles.txt").lines().collect();

    let minimum_replace_frequency = 60;
    let mut result = Vec::new();

    let file = File::open("./temp/ruwiki-all-titles-non-redirects.txt").unwrap();
    for title in BufReader::new(file).lines() {
        let title = title.unwrap();
        let (title_yoficated, number_replaces) = YOFICATION.yoficate(&title, minimum_replace_frequency);
        if number_replaces == 0 { continue; }

        let should_ignore = ignored_regexes.iter().any(|ignored_regex| ignored_regex.is_match(&title_yoficated))
            || ignored_pages.contains(&title.as_str())
            || excluded_articles.contains(&title);
        if should_ignore { continue; }

        let minimum_frequency = YOFICATION.generate_replaces(&title, minimum_replace_frequency).iter().map(|replace| replace.frequency).min().unwrap();
        result.push((title, title_yoficated, minimum_frequency));
    }
    result.sort_by_key(|entry| Reverse(entry.2));
    result
}

fn get_excluded_articles() -> HashSet<String> {
    let input = File::open("./temp/ruwiki-excluded_articles.txt").unwrap();
    BufReader::new(input).lines().map(|line| line.unwrap()).collect()
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

fn get_token(session: &mut Session, token_type: &str) -> String {
    let params = [
        ("format", "json"),
        ("formatversion", "2"),
        ("action", "query"),
        ("meta", "tokens"),
        ("type", token_type),
    ];
    let mut response = Client::new()
        .get("https://ru.wikipedia.org/w/api.php")
        .query(&params)
        .header(header::COOKIE, session.get_cookie_header())
        .send().unwrap();
    session.on_response(&response);
    let response: serde_json::Value = response.json().unwrap();
    let token = response["query"]["tokens"][token_type.to_owned() + "token"].as_str().unwrap();
    assert_ne!(token, r"+\\");
    token.to_owned()
}

fn client_login(session: &mut Session) {
    let token = get_token(session, "login");

    let params = [
        ("format", "json"),
        ("formatversion", "2"),
        ("action", "clientlogin"),
        ("loginreturnurl", "https://ya.ru"),
        ("logintoken", &token),
        ("username", "Дима74"),
        ("password", &env::var("WIKIPEDIA_PASSWORD").unwrap()),
    ];
    let mut response = Client::new()
        .post("https://ru.wikipedia.org/w/api.php")
        .form(&params)
        .header(header::COOKIE, session.get_cookie_header())
        .send().unwrap();
    session.on_response(&response);
    let response: serde_json::Value = response.json().unwrap();
    assert_eq!(response["clientlogin"]["status"].as_str(), Some("PASS"));
}

fn rename_page(session: &mut Session, title_old: &str, title_new: &str) {
    let token = get_token(session, "csrf");

    let params = [
        ("format", "json"),
        ("formatversion", "2"),
        ("action", "move"),
        ("from", title_old),
        ("to", title_new),
        ("reason", "[[ВП:Ё]]"),
        ("movetalk", ""),
        ("token", &token),
    ];
    let mut response = Client::new()
        .post("https://ru.wikipedia.org/w/api.php")
        .form(&params)
        .header(header::COOKIE, session.get_cookie_header())
        .send().unwrap();
    let response: serde_json::Value = response.json().unwrap();
    if response.get("error").is_some() {
        println!("{}", serde_json::to_string_pretty(&response).unwrap());
    }
}

fn yoficate_titles_interactive(from_page: Option<&str>) {
    let mut session = Session::new();
    client_login(&mut session);

    let titles = get_titles_to_yoficate();
    let titles = titles.iter().skip_while(|title| from_page.is_some() && title.0 != from_page.unwrap());
    for (title, title_yoficated, frequency) in titles {
        println!("\n{}, https://ru.wikipedia.org/wiki/{}", frequency, utf8_percent_encode(&title.replace(' ', "_"), CUSTOM_ENCODE_SET));
        println!("{}", title);
        println!("{}", title_yoficated);

        let mut line = String::new();
        io::stdin().lock().read_line(&mut line).unwrap();

        if line == "y\n" {
            rename_page(&mut session, &title, &title_yoficated);
        }
    }
}

fn main() {
    if !Path::new("temp").exists() {
        initial_one_time_setup();
        return;
    }

    print_titles_to_yoficate();
//    yoficate_titles_interactive(None);
}
