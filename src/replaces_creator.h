#ifndef PARSE_REPLACES_CREATOR_H
#define PARSE_REPLACES_CREATOR_H

#include <bits/stdc++.h>
#include "txt_reader.h"
#include "page.h"
#include "word_info.h"
#include "string_helper.h"
#include "alignment.h"
#include "colors.h"
#include "replace_checker.h"
using namespace std;

struct Replace {
    size_t indexWordStart;
    u32string eword;

    Replace(size_t indexWordStart, const u32string &eword) : indexWordStart(indexWordStart), eword(eword) {}
};

struct ReplacesCreator {
//    dword -> eword
    map<u32string, u32string> dwords;
//    eword -> EwordInfo
    map<u32string, EwordInfo> ewords;

    ReplacesCreator() {
        ifstream in("results/frequencies.txt");
        assert(in);

        EwordInfo info;
        while (in >> info && info.getFrequency() > .6) {
            if (isRussianLower(info.eword[0])) {
                dwords[deefication(info.eword)] = info.eword;
                ewords[info.eword] = info;
            }
        }
    }

    vector<Replace> getReplaces(Page page, const set<u32string> &exclusions = {}) {
        vector<Replace> infos;
        u32string text = to32(page.text);
        u32string textLower = tolower(text);
        size_t textEnd = getSectionsStart(text, textLower);
        ReplaceChecker checker(text, textLower);

        TxtReader::readWords(text, textEnd, [&](u32string word, size_t i, size_t j, bool containsE) {
            auto it = dwords.find(word);
            if (it != dwords.end() && exclusions.find(word) == exclusions.end()) {

                if (j < text.length() && text[j] == U'.' && word.length() <= 5) {
                    // возможно это сокращение
                    if (!(j + 2 < text.length() && text[j + 1] == ' ' && isRussianUpper(text[j + 2]))) {
                        return;
                    }
                }

                u32string eword = it->second;
                assert(eword.length() < MAX_LENGTH);
                if (checker.check(i)) {
                    infos.emplace_back(i, eword);
                }
            }
        });
        return infos;
    }
};

#endif //PARSE_REPLACES_CREATOR_H
