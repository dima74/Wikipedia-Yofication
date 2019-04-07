use rocket::get;
use rocket::http::uri::Uri;
use rocket::response::Redirect;

use yofication::lemmatization::lemmatize;

#[get("/redirectToGramotaRuPage/<yoword>")]
pub fn redirect_to_gramota_ru_page(yoword: String) -> Redirect {
    let yoword_lemma = lemmatize(&yoword);
    let url = format!("http://gramota.ru/slovari/dic/?word={}&all=x", Uri::percent_encode(&yoword_lemma));
    Redirect::to(url)
}
