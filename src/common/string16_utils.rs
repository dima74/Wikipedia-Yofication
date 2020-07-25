use std::ops::Range;

pub fn deyoficate(word: &[u16]) -> Vec<u16> {
    let mut word = word.to_owned();
    for c in word.iter_mut() {
        if *c == 'ё' as u16 {
            *c = 'е' as u16;
        }
        if *c == 'Ё' as u16 {
            *c = 'Е' as u16;
        }
    }
    word
}

pub fn is_russian_lower(c: u16) -> bool {
    ('а' as u16 <= c && c <= 'я' as u16) || c == 'ё' as u16
}

pub fn is_russian_upper(c: u16) -> bool {
    ('А' as u16 <= c && c <= 'Я' as u16) || c == 'Ё' as u16
}

pub fn is_russian(c: u16) -> bool {
    is_russian_lower(c) || is_russian_upper(c) || is_modifier(c) || is_apostrophe(c)
}

pub fn is_apostrophe(c: u16) -> bool {
    c == '`' as u16 || c == '’' as u16
}

pub fn is_russian_in_word(c: u16) -> bool {
    is_russian(c) || is_apostrophe(c)
}

pub fn is_modifier(c: u16) -> bool {
    // мягкий перенос
    // ударение
    c == '\u{00AD}' as u16 || c == '\u{0301}' as u16
}

pub fn find_word_ranges(text: &[u16]) -> Vec<Range<usize>> {
    let mut ranges = Vec::new();

    let n = text.len();
    let mut i = 0;
    loop {
        while i < n && !is_russian(text[i]) { i += 1; }
        if i == n { break; }

        let mut j = i + 1;
        while j < n && is_russian_in_word(text[j])
            || j + 1 < n && text[j] == '-' as u16 && is_russian(text[j + 1]) { j += 1; }

        ranges.push(i..j);
        i = j;
    }

    ranges
}
