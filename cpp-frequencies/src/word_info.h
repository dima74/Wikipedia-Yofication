#ifndef PARSE_WORD_INDO_H
#define PARSE_WORD_INDO_H

#include <bits/stdc++.h>
#include "u16string.h"
using namespace std;

// dword --- деёфицированное слово
// yoword --- слово с ё

struct YowordInfo {
    u16string yoword;
    size_t number;
    size_t numberAll;

    float getFrequency() {
        return number / (float) numberAll;
    }

    bool operator<(YowordInfo info) {
//        return number / numberAll > info.number / info.numberAll;
//        return number * info.numberAll > info.number * numberAll;
        return make_pair(number * info.numberAll, number) > make_pair(info.number * numberAll, info.number);
    }
};

ostream &operator<<(ostream &out, YowordInfo info) {
    return out << info.yoword << " " << info.number << " " << info.numberAll;
}

istream &operator>>(istream &in, YowordInfo &info) {
    return in >> info.yoword >> info.number >> info.numberAll;
}

struct DwordInfo {
    size_t number = 0;
    // ключи --- yoword
    map<u16string, size_t> numbers;

    size_t getNumberAll() {
        size_t numberAll = number;
        for (auto p : numbers) {
            numberAll += p.second;
        }
        return numberAll;
    }

    YowordInfo getBest() {
        vector<pair<size_t, u16string>> numbers_v;
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
