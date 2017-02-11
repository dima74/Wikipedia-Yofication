#ifndef PARSE_WORD_INDO_H
#define PARSE_WORD_INDO_H

#include <bits/stdc++.h>
#include "u32string.h"
using namespace std;

// dword --- деёфицированное слово
// eword --- слово с ё

struct EwordInfo {
    u32string eword;
    size_t number;
    size_t numberAll;

    float getFrequency() {
        return number / (float) numberAll;
    }

    bool operator<(EwordInfo info) {
//        return number / numberAll > info.number / info.numberAll;
//        return number * info.numberAll > info.number * numberAll;
        return make_pair(number * info.numberAll, number) > make_pair(info.number * numberAll, info.number);
    }
};

ostream &operator<<(ostream &out, EwordInfo info) {
    return out << info.eword << " " << info.number << " " << info.numberAll;
}

istream &operator>>(istream &in, EwordInfo &info) {
    return in >> info.eword >> info.number >> info.numberAll;
}

struct DwordInfo {
    size_t number = 0;
    // ключи --- eword
    map<u32string, size_t> numbers;

    size_t getNumberAll() {
        size_t numberAll = number;
        for (auto p : numbers) {
            numberAll += p.second;
        }
        return numberAll;
    }

    EwordInfo getBest() {
        vector<pair<size_t, u32string>> numbers_v;
        for (auto p : numbers) {
            numbers_v.emplace_back(p.second, p.first);
        }

        sort(numbers_v.begin(), numbers_v.end());
        reverse(numbers_v.begin(), numbers_v.end());

        auto best = numbers_v[0];
        return {best.second, best.first, getNumberAll()};
    }
};

#endif //PARSE_WORD_INDO_H
