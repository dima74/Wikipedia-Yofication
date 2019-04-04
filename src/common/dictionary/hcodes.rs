use std::error::Error;

use regex::Regex;

pub fn fetch_hcodes_yowords(is_safe: bool) -> Result<Vec<String>, Box<dyn Error>> {
    let file_name = if is_safe { "safe.txt" } else { "not_safe.txt" };
    let url = format!("https://raw.githubusercontent.com/hcodes/eyo-kernel/master/dict_src/{}", file_name);
    let response = reqwest::get(&url)?.text()?;

    let re1 = Regex::new(" *#.*").unwrap();
    let re2 = Regex::new("[(|)]").unwrap();

    let mut result = Vec::new();
    for line in response.lines() {
        let line = re1.replace(line, "");

        if line.contains('(') {
            let mut suffixes = re2.split(&line);
            let base = suffixes.next().ok_or("failed to parse dictionary entry")?;
            for suffix in suffixes {
                result.push(base.to_owned() + suffix);
            }
        } else {
            result.push(line.into_owned());
        }
    }
    Ok(result)
}
