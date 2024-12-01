//! Simple CLI yoficator.
//!
//! ## How to run:
//! ```
//! cargo run --bin yoficate-text
//! ```
//! or
//! ```
//! cargo build --release --bin yoficate-text
//! ./target/release/yoficate-text
//! ```
//!
//! ## How to use
//! CLI accepts single line text requests in format {"text": "..."},
//! and outputs yoficated text in the same format

use serde::{Deserialize, Serialize};
use std::io::BufRead;
use yofication::yofication::Yofication;

const MINIMUM_REPLACE_FREQUENCY: u8 = 60;

fn main() {
    let yofication = Yofication::new().unwrap();

    let stdin = std::io::stdin().lock();

    for line in stdin.lines() {
        let line = line.unwrap();
        let input: Data = serde_json::from_str(&line).unwrap();

        let (result, _) = yofication.yoficate(&input.text, MINIMUM_REPLACE_FREQUENCY);

        let output = Data { text: result };
        println!("{}", serde_json::to_string(&output).unwrap());
    }
}

#[derive(Serialize, Deserialize)]
struct Data {
    text: String,
}
