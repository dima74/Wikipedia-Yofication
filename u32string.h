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