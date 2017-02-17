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
    u16string eword;

    Replace(size_t indexWordStart, const u16string &eword) : indexWordStart(indexWordStart), eword(eword) {}
};

struct ReplacesCreator {
//    dword -> eword
    map<u16string, u16string> dwords;
//    eword -> EwordInfo
    map<u16string, EwordInfo> ewords;

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

                u16string eword = it->second;
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
