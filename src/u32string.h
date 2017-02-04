#ifndef PARSE_U32STRING_H
#define PARSE_U32STRING_H

#include <bits/stdc++.h>
using namespace std;

string to8(u32string s) {
    wstring_convert<codecvt_utf8<char32_t>, char32_t> converter;
    return converter.to_bytes(s);
}

u32string to32(string s) {
    wstring_convert<codecvt_utf8<char32_t>, char32_t> converter;
    return converter.from_bytes(s);
}

string to8(char32_t c) {
    return to8(u32string(1, c));
}

ostream &operator<<(ostream &out, u32string s) {
    return out << to8(s);
}

ostream &operator<<(ostream &out, char32_t c) {
    return out << u32string(1, c);
}

istream &operator>>(istream &in, u32string &s32) {
    string s8;
    if (in >> s8) {
        s32 = to32(s8);
    }
    return in;
}

#endif //PARSE_U32STRING_H
