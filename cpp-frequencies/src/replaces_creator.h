#ifndef PARSE_REPLACES_CREATOR_H
#define PARSE_REPLACES_CREATOR_H

#include <bits/stdc++.h>
#include "txt_reader.h"
#include "page.h"
#include "word_info.h"
#include "string_helper.h"
#include "alignment.h"
#include "colors.h"
#include "replaces_checker.h"
using namespace std;

struct Replace {
    size_t indexWordStart;
    u16string yoword;

    Replace(size_t indexWordStart, const u16string &yoword) : indexWordStart(indexWordStart), yoword(yoword) {}
};

struct ReplacesCreator {
//    dword -> yoword
    map<u16string, u16string> dwords;
//    yoword -> YowordInfo
    map<u16string, YowordInfo> yowords;

    ReplacesCreator(float minReplaceFrequency = 0.6) {
        ifstream in("results/frequencies.txt");
        assert(in);

        YowordInfo info;
        while (in >> info) {
            if (isRussianLower(info.yoword[0]) && info.getFrequency() > minReplaceFrequency && info.number != info.numberAll) {
                dwords[deefication(info.yoword)] = info.yoword;
                yowords[info.yoword] = info;
            }
        }
    }

    vector<Replace> getReplaces(Page page, const set<u16string> &exclusions = {}) {
        vector<Replace> infos;
        u16string text = to16(page.text);
        u16string textLower = tolower(text);
        size_t textEnd = getSectionsStart(text, textLower);
        ReplaceChecker checker(text, textLower);

        TxtReader::readWords(text, textEnd, [&](u16string word, size_t i, size_t j, bool containsE) {
            auto it = dwords.find(word);
            if (it != dwords.end() && exclusions.find(word) == exclusions.end()) {
                if (j < text.length() && text[j] == u'.' && word.length() <= 5) {
                    // возможно это сокращение
                    if (!(j + 2 < text.length() && text[j + 1] == ' ' && isRussianUpper(text[j + 2]))) {
                        return;
                    }
                }

                u16string yoword = it->second;
                assert(yoword.length() < MAX_LENGTH);
                if (checker.check(i)) {
                    infos.emplace_back(i, yoword);
                }
            }
        });
        return infos;
    }
};

#endif //PARSE_REPLACES_CREATOR_H
