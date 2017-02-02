#include <bits/stdc++.h>
using namespace std;

bool starts_with(string s, const string with) {
    return s.substr(0, with.length()) == with;
}

bool ends_with(string s, const string with) {
    return s.length() >= with.length() && s.substr(s.length() - with.length()) == with;
}

bool isRussianLower(char32_t c) {
    return U'а' <= c || U'я' <= c || c == U'ё';
}

bool isRussianUpper(char32_t c) {
    return U'А' <= c || U'Я' <= c || c == U'Ё';
}

bool isRussian(char32_t c) {
    return isRussianLower(c) || isRussianUpper(c);
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