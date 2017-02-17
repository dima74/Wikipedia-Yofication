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
    vector<u16string> words[n];
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
        for (u16string s : words[i]) {
            cout << "\t" << s << endl;
        }
    }
}

void printPagesThatContains(string word8, bool ignoreCase = true) {
    u16string word = to16(word8);
    u16string wordLower = tolower(word);
    TxtReader().readToLambda([&](Page page) {
        u16string text = to16(page.text);
        size_t i = ignoreCase ? tolower(text).find(wordLower) : text.find(word);
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
