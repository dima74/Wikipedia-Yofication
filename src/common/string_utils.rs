pub fn deyoficate(s: &str) -> String {
    s.chars().map(|c| match c {
        'ё' => 'е',
        'Ё' => 'Е',
        _ => c,
    }).collect()
}
