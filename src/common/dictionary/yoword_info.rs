use std::cmp::max;

#[derive(Debug)]
pub struct YowordInfo {
    pub yoword: String,
    pub number_with_yo: u32,
    pub number_all: u32,
    pub is_safe: Option<bool>,
}

impl YowordInfo {
    pub fn frequency_wikipedia(&self) -> Option<u8> {
        if self.number_all == 0 {
            None
        } else {
            Some((self.number_with_yo * 100 / self.number_all) as u8)
        }
    }

    pub fn frequency(&self) -> u8 {
        let frequency_hcodes: u8 = match self.is_safe {
            None => 0,
            Some(is_safe) => if is_safe { 39 } else { 20 },
        };

        let frequency_wikipedia = self.frequency_wikipedia();
        match frequency_wikipedia {
            None => frequency_hcodes,
            Some(frequency_wikipedia) =>
                if frequency_wikipedia > 50 && self.is_safe == Some(true) {
                    100
                } else {
                    max(frequency_wikipedia, frequency_hcodes)
                }
        }
    }
}
