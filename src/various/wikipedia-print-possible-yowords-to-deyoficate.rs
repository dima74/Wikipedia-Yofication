use itertools::Itertools;

use yofication::dictionary;

fn main() {
    let yowords = dictionary::wikipedia::fetch_wikipedia_yoword_infos();

    yowords.into_iter()
        .filter(|yoword| 0 < yoword.number_with_yo && yoword.number_with_yo < 10 && yoword.number_all > 1000)
        .sorted_by_key(|yoword| yoword.number_all)
        .for_each(|yoword| println!("{:2}  {:7}  {}", yoword.number_with_yo, yoword.number_all, yoword.yoword));
}
