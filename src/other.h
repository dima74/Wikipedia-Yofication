#ifndef PARSE_OTHER_H
#define PARSE_OTHER_H

#include <bits/stdc++.h>
#include "word_info.h"
#include "string_helper.h"
#include "page.h"
#include "txt_reader.h"
#include "alignment.h"
#include "wikipedia_api.h"
#include "colors.h"
using namespace std;

void showFrequenciesInfo() {
    ifstream in("results/frequencies.txt");
    assert(in);

    EwordInfo info;
    int n = 10;
    size_t numbers[n] = {0};
    vector<u32string> words[n];
    while (in >> info) {
        if (isRussianLower(info.eword[0])) {
            size_t frequency = info.number * n / info.numberAll;
            if (rand() % 100 == 0) {
                words[frequency].push_back(info.eword);
            }
            ++numbers[frequency];
        }
    }

    for (int i = 0; i < n; ++i) {
        printf("%2d %7zu\n", i, numbers[i]);
    }

    cout << endl;
    for (int i = 0; i < n; ++i) {
        cout << i << endl;
        for (u32string s : words[i]) {
            cout << "\t" << s << endl;
        }
    }
}

void printPagesThatContains(string word8) {
    u32string word = to32(word8);
    u32string word_lower = tolower(word);
    TxtReader().readToLambda([&](Page page) {
        u32string text = to32(page.text);
        u32string text_lower = tolower(text);
        size_t i = text_lower.find(word_lower);
        if (i != string::npos) {
            auto context = getWordContext(text, word, i);
            cout << getTitleAligned(page.title) << endl;
            cout << getPageUrl(page.title) << endl;
            cout << context.first << cyan << word << def << context.second << endl;
            cout << endl;
            return;
        }
    });
}

#endif //PARSE_OTHER_H
