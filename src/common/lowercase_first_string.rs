use std::cmp::Ordering;

use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize)]
pub struct LowercaseFirstString(pub String);

fn get_sort_tuple(s: &LowercaseFirstString) -> (bool, &str) {
    (s.0.chars().next().unwrap().is_uppercase(), &s.0)
}

impl Ord for LowercaseFirstString {
    fn cmp(&self, other: &Self) -> Ordering {
        get_sort_tuple(self).cmp(&get_sort_tuple(other))
    }
}

impl PartialOrd for LowercaseFirstString {
    fn partial_cmp(&self, other: &Self) -> Option<Ordering> {
        Some(self.cmp(other))
    }
}

impl PartialEq for LowercaseFirstString {
    fn eq(&self, other: &Self) -> bool {
        self.cmp(other) == Ordering::Equal
    }
}

impl Eq for LowercaseFirstString {}
