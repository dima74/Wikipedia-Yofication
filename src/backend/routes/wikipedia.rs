use std::error::Error;

use reqwest::blocking::Client;
use rocket::{FromForm, get, post, State};
use rocket::request::Form;
use rocket_contrib::json::Json;
use serde_json::json;

use yofication::yofication::Replace;

use crate::mixpanel;
use crate::all_data::AllData;

#[get("/wikipedia/randomPageName?<minimum_number_replaces_for_continuous_yofication>&<maximum_number_replaces_for_continuous_yofication>&<flag>")]
pub fn random_page_name(
    minimum_number_replaces_for_continuous_yofication: Option<usize>,
    maximum_number_replaces_for_continuous_yofication: Option<usize>,
    all_data: State<AllData>,
    flag: Option<bool>,
) -> String {
    if flag.is_none() {
        let id = minimum_number_replaces_for_continuous_yofication.map_or("default".to_owned(), |v| v.to_string());
        mixpanel::track("random_page_name", &id, json!({}));
    }

    let minimum_number_replaces_for_continuous_yofication = minimum_number_replaces_for_continuous_yofication.unwrap_or(10);
    let data = all_data.get_data();
    data.continuous_yofication_pages.get_random_page(minimum_number_replaces_for_continuous_yofication, maximum_number_replaces_for_continuous_yofication)
}

#[derive(FromForm)]
pub struct ReplacesByWikitextForm {
    #[form(field = "minimumReplaceFrequency")]
    minimum_replace_frequency: u8,
    wikitext: String,
    #[form(field = "currentPageName")]
    current_page_name: Option<String>,
    flag: Option<bool>,
}

#[post("/wikipedia/replacesByWikitext", data = "<form>")]
pub fn generate_replaces_by_wikitext(form: Form<ReplacesByWikitextForm>, all_data: State<AllData>) -> Json<Vec<Replace>> {
    if form.flag.is_none() {
        let properties = json!({ "minimum_replace_frequency": form.minimum_replace_frequency });
        mixpanel::track("replaces_by_wikitext", form.current_page_name.as_deref().unwrap_or("unknown"), properties);
    }
    let data = all_data.get_data();
    Json(data.yofication.generate_replaces(&form.wikitext, form.minimum_replace_frequency))
}

fn fetch_wikipedia_page(title: &str) -> Result<(u64, String, String), Box<dyn Error>> {
    let params = [
        ("format", "json"),
        ("formatversion", "2"),
        ("action", "query"),
        ("prop", "revisions"),
        ("titles", title),
        ("rvprop", "ids|content|timestamp"),
        ("rvslots", "main")
    ];
    let response = Client::new()
        .get("https://ru.wikipedia.org/w/api.php")
        .query(&params)
        .send()?;
    let response: serde_json::Value = response.json()?;
    let page_info = &response["query"]["pages"][0]["revisions"][0];

    let revision = page_info["revid"].as_u64().ok_or("Can't parse revid")?;
    let timestamp = page_info["timestamp"].as_str().ok_or("Can't parse timestamp")?.to_owned();
    let wikitext = page_info["slots"]["main"]["content"].as_str().ok_or("Can't parse slots.main.content")?.to_owned();
    Ok((revision, timestamp, wikitext))
}

#[derive(FromForm)]
pub struct ReplacesByTitleForm {
    #[form(field = "minimumReplaceFrequency")]
    minimum_replace_frequency: u8,
    title: String,
    flag: Option<bool>,
}

#[get("/wikipedia/replacesByTitle?<form..>")]
pub fn generate_replaces_by_title(form: Form<ReplacesByTitleForm>, all_data: State<AllData>) -> Result<Json<serde_json::Value>, Box<dyn Error>> {
    if form.flag.is_none() {
        let properties = json!({ "minimum_replace_frequency": form.minimum_replace_frequency });
        mixpanel::track("replaces_by_title", &form.title, properties);
    }
    let (revision, timestamp, wikitext) = fetch_wikipedia_page(&form.title)?;
    let data = all_data.get_data();

    Ok(Json(json!({
        "revision": revision,
        "timestamp": timestamp,
        "replaces": data.yofication.generate_replaces(&wikitext, form.minimum_replace_frequency)
    })))
}

#[derive(FromForm)]
pub struct WordPagesForm {
    word: String,
    #[form(field = "pageIndex")]
    page_index: Option<usize>,
    #[allow(dead_code)]
    flag: Option<bool>,
}

#[get("/wikipedia/wordPage?<form..>")]
pub fn get_word_page(form: Form<WordPagesForm>, all_data: State<AllData>) -> String {
    let page_index = form.page_index.unwrap_or(0);
    let data = all_data.get_data();
    data.words_pages.get_word_page(&form.word, page_index).unwrap_or_default()
}
