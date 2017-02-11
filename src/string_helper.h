#ifndef PARSE_STRING_HELPER_H
#define PARSE_STRING_HELPER_H

#include <bits/stdc++.h>
using namespace std;

bool startsWith(string s, const string with) {
    return s.substr(0, with.length()) == with;
}

bool endsWith(string s, const string with) {
    return s.length() >= with.length() && s.substr(s.length() - with.length()) == with;
}

void replaceAll(string &source, string search, string replace) {
    size_t position = 0;
    while ((position = source.find(search, position)) != string::npos) {
        source.replace(position, search.length(), replace);
        position += replace.length();
    }
}

bool isRussianLower(char32_t c) {
    return (U'а' <= c && c <= U'я') || c == U'ё';
}

bool isRussianUpper(char32_t c) {
    return (U'А' <= c && c <= U'Я') || c == U'Ё';
}

bool isRussian(char32_t c) {
    return isRussianLower(c) || isRussianUpper(c);
}

bool isRussianDelimiter(char32_t c) {
    return c == U'́'         // ударение
           || c == U'-'         // обычный дефис
           || c == U'\u00AD';   // мягкий перенос
}

bool isRussianInText(const u32string &text, size_t i) {
    return isRussian(text[i])
           || isRussianDelimiter(text[i]) && 0 < i && i + 1 < text.length() && isRussian(text[i - 1]) && isRussian(text[i + 1]);
}

bool isEnglishLower(char32_t c) {
    return U'a' <= c && c <= U'z';
}

bool isEnglishUpper(char32_t c) {
    return U'A' <= c && c <= U'Z';
}

bool isEnglish(char32_t c) {
    return isEnglishLower(c) || isEnglishUpper(c);
}

bool isDigit(char32_t c) {
    return U'0' <= c && c <= U'9';
}

bool isSentence(char32_t c) {
    const u32string allowedChars = U"  ,()[]{}<>«»:-—|&;'\"/";
    return isRussian(c) || isEnglish(c) || isDigit(c) || allowedChars.find(c) != string::npos;
}

bool isE(char32_t c) {
    return c == U'ё' || c == U'Ё';
}

u32string deefication(u32string s) {
    for (char32_t &c : s) {
        if (c == U'ё') {
            c = U'е';
        }
        if (c == U'Ё') {
            c = U'Е';
        }
    }
    return s;
}

#endif //PARSE_STRING_HELPER_H
