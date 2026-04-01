use rocket::{post, State};
use rocket_contrib::json::Json;
use serde::{Deserialize, Serialize};

use crate::all_data::AllData;

#[derive(Deserialize)]
pub struct YoficateForm {
    #[serde(rename = "minimumReplaceFrequency")]
    minimum_replace_frequency: u8,
    text: String,
}

#[derive(Serialize)]
pub struct YoficateResponse {
    #[serde(rename = "textYoficated")]
    text_yoficated: String,
    #[serde(rename = "numberReplaces")]
    number_replaces: usize,
}

#[post("/yoficate", data = "<form>")]
pub fn yoficate(form: Json<YoficateForm>, all_data: State<AllData>) -> Json<YoficateResponse> {
    let data = all_data.get_data();
    let (text_yoficated, info) = data.yofication.yoficate(&form.text, form.minimum_replace_frequency);
    let number_replaces = info.number_replaces;
    Json(YoficateResponse { text_yoficated, number_replaces })
}
