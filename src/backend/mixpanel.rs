use std::env;

use lazy_static::lazy_static;
use reqwest;
use serde_json::json;

lazy_static! {
    static ref MIXPANEL_TOKEN: String = env::var("MIXPANEL_TOKEN").expect("MIXPANEL_TOKEN env variable is missing");
}

pub fn init() {
    assert!(!MIXPANEL_TOKEN.is_empty());
}

pub fn track(event: &str, id: &str, mut properties: serde_json::Value) {
    properties["distinct_id"] = json!(id);
    properties["token"] = json!(MIXPANEL_TOKEN.to_owned());

    let data = json!({
        "event": event,
        "properties": properties,
    }).to_string();
    let data_base64 = base64::encode(data.as_bytes());
    let url = format!("https://api.mixpanel.com/track/?data={}", data_base64);
    let response = reqwest::get(&url);
    if response.is_err() {
        println!("{:?}", response);
    }
}
