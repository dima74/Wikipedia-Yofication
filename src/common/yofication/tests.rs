use lazy_static::lazy_static;

use crate::common::string_utils::deyoficate;

use super::*;

lazy_static! {
    static ref YOFICATION: Yofication = Yofication::new().unwrap();
}

fn test_yofication_generic(text: &str, expected: &str) {
    let (yoficated_text, _) = YOFICATION.yoficate(text, 60);
    assert_eq!(expected, yoficated_text);
}

fn test_yofication(expected: &str) {
    let text = deyoficate(expected);
    test_yofication_generic(&text, expected);
}

fn test_yofication_with_frequency(text: &str, expected: &str, minimum_replace_frequency: u8) {
    let (yoficated_text, _) = YOFICATION.yoficate(text, minimum_replace_frequency);
    assert_eq!(expected, yoficated_text);
}

fn test_noyofication(text: &str) {
    test_yofication_generic(text, text);
}

#[test]
fn test_basic() {
    test_yofication("зелёный");
    test_yofication("при нём был");
}

#[test]
fn test_hyphens() {
    test_yofication("абвгд-зелёный");
    test_yofication("абвгд-жёлто-зелёный");
    test_yofication("24-зелёный");
    test_yofication("трёх- и четырёх- ...");
}

#[test]
fn test_utf32() {
    test_yofication("𝄞 зелёный 𝄞 зелёный 𝄞");
}

#[test]
fn test_modifiers() {
    test_yofication("ёфика́тор");
    test_yofication("зелё­ный");
}

#[test]
fn test_apostrophes() {
    test_noyofication("ее`ее, ее’ее");
    test_noyofication("зеле`ный, зеле’ный");
}

#[test]
fn test_words_with_yo() {
    // не все «ё»
    test_yofication_generic("четырёхзвездочный", "четырёхзвёздочный");
    test_yofication_generic("четырехзвёздочный", "четырёхзвёздочный");

    // лишняя «ё»
    test_yofication_generic("чётырёхзвёздочный", "четырёхзвёздочный");

    // «ё» не в том месте
    test_yofication_generic("чётырехзвездочный", "четырёхзвёздочный");
}

#[test]
fn test_abbreviation() {
    test_noyofication("нем.");
    test_noyofication("мед.");
    test_noyofication("жен.");
    test_yofication_with_frequency("нем.", "нём.", 25);
    test_yofication_with_frequency("мед.", "мёд.", 25);
    test_yofication_with_frequency("жен.", "жён.", 25);
    test_yofication("зелёный.");
}

#[test]
fn test_after_link() {
    test_noyofication("[[верхн]]ее");
    test_noyofication("[[верхн]]ее село");
}

#[test]
fn test_inside_link() {
    test_yofication("[[её]]");
    test_yofication("[[её да её]]");
    test_yofication("[[её|её]]");
    test_yofication("[[ её ]]");
}

#[test]
fn test_inside_tags() {
    test_noyofication("{{начало цитаты}}  ее  {{конец цитаты}}");
    test_noyofication("{{цитата|          ее  }}");
    test_noyofication("{{quote box|       ее  }}");
    test_noyofication("<blockquote>       ее  </blockquote>");
    test_noyofication("<ref>              ее  </ref>");
    test_noyofication("<poem>             ее  </poem>");
    test_noyofication("<nowiki>           ее  </nowiki>");
}

#[test]
fn test_self_closed_tags() {
    test_noyofication("<ref>ее</ref>");
    test_yofication(r#"<ref name="...">...</ref><ref name="..." /> её <ref name="..." /><ref name="...">...</ref>"#);
}

#[test]
fn test_seven() {
    test_noyofication(" семь ");
}
