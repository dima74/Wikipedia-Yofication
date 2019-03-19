use lazy_static::lazy_static;

use super::*;

lazy_static! {
    static ref YOFICATION: Yofication = Yofication::new().unwrap();
}

fn test_yofication(text: &str, expected: &str) {
    let (yoficated_text, _) = YOFICATION.yoficate(text, 60);
    assert_eq!(expected, yoficated_text);
}

fn test_noyofication(text: &str) {
    test_yofication(text, text);
}

#[test]
fn test_basic() {
    test_yofication("зеленый", "зелёный");
    test_yofication("при нем был", "при нём был");
}

#[test]
fn test_hyphens() {
    test_yofication("абвгд-зеленый", "абвгд-зелёный");
    test_yofication("абвгд-желто-зеленый", "абвгд-жёлто-зелёный");
    test_yofication("24-зеленый", "24-зелёный");
}

#[test]
fn test_utf32() {
    test_yofication("𝄞 зеленый 𝄞 зеленый 𝄞", "𝄞 зелёный 𝄞 зелёный 𝄞");
}

#[test]
fn test_modifiers() {
    test_yofication("ефика́тор", "ёфика́тор");
    test_yofication("зеле­ный", "зелё­ный");
}

#[test]
fn test_apostrophes() {
    test_noyofication("ее`ее, ее’ее");
    test_noyofication("зеле`ный, зеле’ный");
}

#[test]
fn test_words_with_yo() {
    test_yofication("четырёхзвездочный", "четырёхзвёздочный");
    test_yofication("четырехзвёздочный", "четырёхзвёздочный");
}

#[test]
fn test_abbreviation() {
    test_noyofication("нем.");
    test_yofication("зеленый.", "зелёный.");
}

#[test]
fn test_after_link() {
    test_noyofication("[[верхн]]ее");
    test_noyofication("[[верхн]]ее село");
}

#[test]
fn test_inside_link() {
    test_yofication("[[ее]]", "[[её]]");
    test_yofication("[[ее да ее]]", "[[её да её]]");
    test_yofication("[[ее|ее]]", "[[её|её]]");
    test_yofication("[[ ее ]]", "[[ её ]]");
}

#[test]
fn test_inside_tags() {
    test_noyofication("{{начало цитаты}}  ее  {{конец цитаты}}");
    test_noyofication("{{цитата|          ее  }}");
    test_noyofication("{{quote box|       ее  }}");
    test_noyofication("<blockquote>       ее  </blockquote>");
    test_noyofication("<ref>              ее  </ref>");
    test_noyofication("<poem>             ее  </poem>");
}
