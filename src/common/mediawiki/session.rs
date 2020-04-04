use cookie::{Cookie, CookieJar};
use itertools::Itertools;
use reqwest::blocking::Response;
use reqwest::header;

pub struct Session {
    cookie_jar: CookieJar,
}

impl Session {
    pub fn new() -> Session {
        Session { cookie_jar: CookieJar::new() }
    }

    pub fn on_response(&mut self, response: &Response) {
        let cookie_headers_from_server = response.headers().get_all(header::SET_COOKIE);
        for cookie in cookie_headers_from_server.iter() {
            let cookie = cookie.to_str().unwrap();
            let cookie = Cookie::parse(cookie).unwrap();
            self.cookie_jar.add(cookie.into_owned());
        }
    }

    pub fn get_cookie_header(&self) -> String {
        self.cookie_jar.delta()
            .map(|cookie| format!("{}={}", cookie.name(), cookie.value()))
            .join("; ")
    }
}
