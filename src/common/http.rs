use reqwest::blocking::{Client, Response};

const USER_AGENT: &str = concat!(
    env!("CARGO_PKG_NAME"),
    "/",
    env!("CARGO_PKG_VERSION"),
    " (+https://github.com/dima74/Wikipedia-Yofication)"
);

pub fn blocking_client() -> Result<Client, reqwest::Error> {
    Client::builder()
        .user_agent(USER_AGENT)
        .build()
}

pub fn blocking_get(url: &str) -> Result<Response, reqwest::Error> {
    blocking_client()?
        .get(url)
        .send()?
        .error_for_status()
}
