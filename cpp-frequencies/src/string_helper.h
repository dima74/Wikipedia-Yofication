#ifndef PARSE_STRING_HELPER_H
#define PARSE_STRING_HELPER_H

#include <bits/stdc++.h>
#include "u16string.h"
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

size_t findFirst(u16string source, vector<u16string> whats, size_t startPosition) {
    size_t position = string::npos;
    for (u16string what : whats) {
        position = min(position, source.find(what, startPosition));
    }
    return position;
}

bool isRussianLower(char16_t c) {
    return (u'а' <= c && c <= u'я') || c == u'ё';
}

bool isRussianUpper(char16_t c) {
    return (u'А' <= c && c <= u'Я') || c == u'Ё';
}

bool isRussian(char16_t c) {
    return isRussianLower(c) || isRussianUpper(c);
}

bool isRussianDelimiter(char16_t c) {
    return c == u'\u0301'       // ударение
           || c == u'-'         // обычный дефис
           || c == u'\u00AD';   // мягкий перенос
}

bool isRussianInText(const u16string &text, size_t i) {
    return isRussian(text[i])
           || isRussianDelimiter(text[i]) && 0 < i && i + 1 < text.length() && isRussian(text[i - 1]) && isRussian(text[i + 1]);
}

bool isEnglishLower(char16_t c) {
    return u'a' <= c && c <= u'z';
}

bool isEnglishUpper(char16_t c) {
    return u'A' <= c && c <= u'Z';
}

bool isEnglish(char16_t c) {
    return isEnglishLower(c) || isEnglishUpper(c);
}

bool isDigit(char16_t c) {
    return u'0' <= c && c <= u'9';
}

bool isSentence(char16_t c) {
    const u16string allowedChars = u"  ,()[]{}<>«»:-—|&;'\"/";
    return isRussian(c) || isEnglish(c) || isDigit(c) || allowedChars.find(c) != string::npos;
}

bool isE(char16_t c) {
    return c == u'ё' || c == u'Ё';
}

u16string deefication(u16string s) {
    for (char16_t &c : s) {
        if (c == u'ё') {
            c = u'е';
        }
        if (c == u'Ё') {
            c = u'Е';
        }
    }
    return s;
}

#endif //PARSE_STRING_HELPER_H
