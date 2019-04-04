use std::cmp::Ordering;

#[derive(Debug)]
pub struct YowordInfo {
    pub yoword: String,
    pub number_with_yo: u32,
    pub number_all: u32,
}

impl YowordInfo {
    pub fn frequency(&self) -> f32 {
        if self.number_all == 0 {
            0.0
        } else {
            self.number_with_yo as f32 / self.number_all as f32
        }
    }
}

impl YowordInfo {
    /// лексикографически, сначала начинающиеся с маленькой буквы
    pub fn cmp(&self, other: &Self) -> Ordering {
        fn get_sort_tuple(yoword: &YowordInfo) -> (bool, bool, &str) {
            (yoword.number_with_yo == 0, yoword.yoword.chars().next().unwrap().is_uppercase(), &yoword.yoword)
        }

        get_sort_tuple(self).partial_cmp(&get_sort_tuple(other)).unwrap()
    }
}
