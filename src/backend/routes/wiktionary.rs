use std::error::Error;

use reqwest::Client;
use rocket::get;
use rocket::http::uri::Uri;
use rocket::response::Redirect;

fn get_wiktionary_article_by_prefix(prefix: &str) -> Result<Option<String>, Box<dyn Error>> {
    let params = [
        ("format", "json"),
        ("formatversion", "2"),
        ("action", "query"),
        ("generator", "allpages"),
        ("gapprefix", prefix),
    ];
    let mut response = Client::new()
        .get("https://ru.wiktionary.org/w/api.php")
        .query(&params)
        .send()?;
    let response: serde_json::Value = response.json()?;
    if response.get("query").is_none() { return Ok(None); }

    let results = response["query"]["pages"].as_array().unwrap();
    let article = results[0]["title"].as_str().unwrap().to_owned();
    Ok(Some(article))
}

fn get_wiktionary_article(yoword: &str) -> Result<Option<String>, Box<dyn Error>> {
    let mut yoword = yoword.to_owned();
    while yoword.len() > 0 {
        let article = get_wiktionary_article_by_prefix(&yoword)?;
        if article.is_some() {
            return Ok(article);
        }
        yoword.pop();
    }
    Ok(None)
}

#[get("/redirectToWiktionaryArticle/<yoword>")]
pub fn redirect_to_wiktionary_article(yoword: String) -> Result<Result<Redirect, String>, Box<dyn Error>> {
    let article = get_wiktionary_article(&yoword)?;
    match article {
        None => Ok(Err("Ничего не найдено".to_owned())),
        Some(article) => {
            let url = "https://ru.wiktionary.org/wiki/".to_owned() + &Uri::percent_encode(&article);
            Ok(Ok(Redirect::to(url)))
        }
    }
}

#[get("/wiktionaryArticle/<yoword>")]
pub fn wiktionary_article(yoword: String) -> Result<String, Box<dyn Error>> {
    get_wiktionary_article(&yoword).map(|article| article.unwrap_or("Ничего не найдено".to_owned()))
}
