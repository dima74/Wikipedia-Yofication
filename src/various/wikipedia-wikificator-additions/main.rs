use std::cmp::Reverse;

use itertools::Itertools;

use yofication::dictionary;

fn main() {
    let yoword_infos = dictionary::wikipedia::fetch_wikipedia_yoword_infos();
    let proposed_yowords = yoword_infos.into_iter()
        .filter(|yoword| yoword.frequency_wikipedia().unwrap() > 60)
        .sorted_by_key(|yoword| Reverse(yoword.number_all - yoword.number_with_yo))
        .take(20);

    for yoword in proposed_yowords {
        let frequency = yoword.frequency_wikipedia().unwrap();
        println!("{:6} {:6}  {:3}  {}", yoword.number_all - yoword.number_with_yo, yoword.number_all, frequency, yoword.yoword);
    }
}
