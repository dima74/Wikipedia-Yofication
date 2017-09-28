#ifndef PARSE_U16STRING_H
#define PARSE_U16STRING_H

#include <bits/stdc++.h>
using namespace std;

#include <fmt/format.h>
#include <fmt/format.cc>
using namespace fmt;

struct LocaleSetter {
    LocaleSetter() {
        setlocale(LC_ALL, "ru_RU.UTF-8");
    }
};

LocaleSetter localeSetter;

string to8(u16string s) {
    wstring_convert<codecvt_utf8_utf16<char16_t>, char16_t> converter;
    return converter.to_bytes(s);
}

u16string to16(string s) {
    wstring_convert<codecvt_utf8_utf16<char16_t>, char16_t> converter;
    return converter.from_bytes(s);
}

char16_t toupper_char(char16_t c) {
    return (char16_t) towupper(c);
}

char16_t tolower_char(char16_t c) {
    return (char16_t) towlower(c);
}

u16string toupper(u16string s) {
    transform(s.begin(), s.end(), s.begin(), toupper_char);
    return s;
}

u16string tolower(u16string s) {
    transform(s.begin(), s.end(), s.begin(), tolower_char);
    return s;
}

ostream &operator<<(ostream &out, u16string s) {
    return out << to8(s);
}

ostream &operator<<(ostream &out, char16_t c) {
    return out << u16string(1, c);
}

istream &operator>>(istream &in, u16string &s16) {
    string s8;
    if (in >> s8) {
        s16 = to16(s8);
    }
    return in;
}

#endif //PARSE_U16STRING_H