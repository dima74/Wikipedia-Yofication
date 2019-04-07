use std::fs::File;
use std::io::Write;
use std::process::{Command, Stdio};

use crate::is_development;

// https://tech.yandex.ru/mystem/
pub fn init() {
    if is_development() { return; }

    const MYSTEM_URL: &str = "https://download.cdn.yandex.net/mystem/mystem-3.1-linux-64bit.tar.gz";
    let mut response = reqwest::get(MYSTEM_URL).expect("mystem: Failed to fetch binary");
    let mut file = File::create("mystem.tar.gz").expect("mystem: Failed to save binary");
    response.copy_to(&mut file).expect("mystem: Failed to save binary");

    Command::new("tar")
        .arg("-xzf")
        .arg("mystem.tar.gz")
        .output()
        .expect("mystem: Failed to untar binary");
}

pub fn lemmatize(word: &str) -> String {
    let mystem_file = if is_development() { "temp/lemmatization/mystem" } else { "mystem" };
    let mut child = Command::new(mystem_file)
        .arg("-nld")
        .stdin(Stdio::piped())
        .stdout(Stdio::piped())
        .spawn()
        .expect("mystem: failed to spawn");

    {
        let stdin = child.stdin.as_mut().expect("mystem: Failed to open stdin");
        stdin.write_all(word.as_bytes()).expect("mystem: Failed to write to stdin");
    }

    let output = child.wait_with_output().expect("mystem: Failed to read stdout");
    let output = String::from_utf8(output.stdout).expect("mystem: Failed to decode output as utf8");
    output.trim().to_owned()
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    #[ignore]
    fn basic() {
        assert_eq!(lemmatize("зелёная"), "зеленый");
    }
}
