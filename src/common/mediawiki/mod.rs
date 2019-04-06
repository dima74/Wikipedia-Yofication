use reqwest::{Client, header};

mod session;

pub struct Api {
    api_url: String,
    session: session::Session,
}

impl Api {
    pub fn new(code_or_url: &str) -> Api {
        let url = if code_or_url.starts_with("http") {
            code_or_url.to_owned()
        } else {
            format!("https://{}.wikipedia.org/w/apiphp", code_or_url)
        };
        let session = session::Session::new();
        Api { api_url: url, session }
    }

    pub fn get_token(self: &mut Self, token_type: &str) -> String {
        let params = [
            ("format", "json"),
            ("formatversion", "2"),
            ("action", "query"),
            ("meta", "tokens"),
            ("type", token_type),
        ];
        let mut response = Client::new()
            .get(&self.api_url)
            .query(&params)
            .header(header::COOKIE, self.session.get_cookie_header())
            .send().unwrap();
        self.session.on_response(&response);
        let response: serde_json::Value = response.json().unwrap();
        let token = response["query"]["tokens"][token_type.to_owned() + "token"].as_str().unwrap();
        assert_ne!(token, r"+\\");
        token.to_owned()
    }

    fn iterate_all<T: FnMut(serde_json::Value) -> ()>(self: &Self, request_continue: &str, response_continue: &str, params: &[(&str, &str)], mut consumer: T) {
        let mut from_page = "".to_owned();
        loop {
            let mut response = Client::new()
                .get(&self.api_url)
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

    fn get_all_category_members(self: &Self, category: &str, cmtype: &str) -> Vec<String> {
        let mut all_titles = Vec::new();

        let params = [
            ("format", "json"),
            ("formatversion", "2"),
            ("action", "query"),
            ("list", "categorymembers"),
            ("cmtitle", category),
            ("cmtype", cmtype),
            ("cmlimit", "5000"),
        ];
        self.iterate_all("cmcontinue", "cmcontinue", &params, |response| {
            let titles = response["query"]["categorymembers"].as_array().unwrap()
                .iter().map(|o| o["title"].as_str().unwrap().to_owned());
            all_titles.extend(titles);
        });
        all_titles
    }

    pub fn get_all_category_pages(self: &Self, category: &str) -> Vec<String> {
        self.get_all_category_members(category, "page")
    }

    pub fn get_all_category_subcategories(self: &Self, category: &str) -> Vec<String> {
        self.get_all_category_members(category, "subcat")
    }

    fn get_all_titles(self: &Self, apfilterredir: &str) -> Vec<String> {
        let mut all_titles = Vec::new();

        let params = [
            ("format", "json"),
            ("formatversion", "2"),
            ("action", "query"),
            ("list", "allpages"),
            ("apfilterredir", apfilterredir),
            ("aplimit", "5000"),
        ];
        self.iterate_all("apfrom", "apcontinue", &params, |response| {
            let titles = response["query"]["allpages"].as_array().unwrap()
                .iter().map(|o| o["title"].as_str().unwrap().to_owned());
            all_titles.extend(titles);
        });
        all_titles
    }

    pub fn get_all_titles_non_redirects(self: &Self) -> Vec<String> {
        self.get_all_titles("nonredirects")
    }

    pub fn get_all_titles_redirects(self: &Self) -> Vec<String> {
        self.get_all_titles("redirects")
    }

    pub fn client_login(self: &mut Self, username: &str, password: &str) {
        let token = self.get_token("login");

        let params = [
            ("format", "json"),
            ("formatversion", "2"),
            ("action", "clientlogin"),
            ("loginreturnurl", "https://ya.ru"),
            ("logintoken", &token),
            ("username", username),
            ("password", password),
        ];
        let mut response = Client::new()
            .post(&self.api_url)
            .form(&params)
            .header(header::COOKIE, self.session.get_cookie_header())
            .send().unwrap();
        self.session.on_response(&response);
        let response: serde_json::Value = response.json().unwrap();
        assert_eq!(response["clientlogin"]["status"].as_str(), Some("PASS"));
    }

    pub fn rename_page(self: &mut Self, title_old: &str, title_new: &str, reason: &str) {
        let token = self.get_token("csrf");

        let params = [
            ("format", "json"),
            ("formatversion", "2"),
            ("action", "move"),
            ("from", title_old),
            ("to", title_new),
            ("reason", reason),
            ("movetalk", ""),
            ("watchlist", "watch"),
            ("token", &token),
        ];
        let mut response = Client::new()
            .post(&self.api_url)
            .form(&params)
            .header(header::COOKIE, self.session.get_cookie_header())
            .send().unwrap();
        let response: serde_json::Value = response.json().unwrap();
        if response.get("error").is_some() {
            println!("{}", serde_json::to_string_pretty(&response).unwrap());
            panic!(serde_json::to_string_pretty(&response).unwrap());
        }
    }
}
