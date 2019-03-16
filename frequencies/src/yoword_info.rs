use std::cmp::Ordering;

#[derive(Debug)]
pub struct YowordInfo {
    pub yoword: String,
    pub number_with_yo: u32,
    pub number_all: u32,
}

impl YowordInfo {
    pub fn frequency(&self) -> f32 {
        self.number_with_yo as f32 / self.number_all as f32
    }
}

impl YowordInfo {
    pub fn cmp(&self, other: &Self) -> Ordering {
        let self_tuple = (self.frequency(), self.number_all);
        let other_tuple = (other.frequency(), other.number_all);
        self_tuple.partial_cmp(&other_tuple).unwrap()
    }
}
