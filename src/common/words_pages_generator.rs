use crate::dictionary::YowordInfo;

// bool means: true if world should be yoficated, false if deyoficated
pub fn get_yoword_number_pages(yoword: &YowordInfo) -> (bool, u32) {
    if yoword.number_with_yo == 0 { return (true, 0); }

    if yoword.number_all < 100 || yoword.frequency() > 60 {
        (true, yoword.number_all - yoword.number_with_yo)
    } else if yoword.number_with_yo < 10 && yoword.number_all > 100 {
        // вероятно, правильное написание слова — без «ё»
        (false, yoword.number_with_yo)
    } else {
        (true, 0)
    }
}
