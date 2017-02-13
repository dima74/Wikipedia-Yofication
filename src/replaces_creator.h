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
    u32string sentence0;
    u32string sentence1;

    Replace(size_t indexWordStart, const u32string &eword, const u32string &sentence0, const u32string &sentence1) : indexWordStart(indexWordStart), eword(eword), sentence0(sentence0), sentence1(sentence1) {}

    u32string getWord(u32string text) {
        return text.substr(indexWordStart, eword.length());
    }

    friend ostream &operator<<(ostream &out, Replace replace) {
        return cout << replace.sentence0 << cyan << replace.eword << def << replace.sentence1 << endl;
    }
};

struct ReplacesCreator : public AbstractParser {
//    dword -> eword
    map<u32string, u32string> dwords;
//    eword -> EwordInfo
    map<u32string, EwordInfo> ewords;

    ReplacesCreator() {
        ifstream in("results/frequencies.txt");
        assert(in);

        EwordInfo info;
        while (in >> info && info.getFrequency() > .5) {
            if (isRussianLower(info.eword[0])) {
                dwords[deefication(info.eword)] = info.eword;
                ewords[info.eword] = info;
            }
        }
        dwords.erase(U"свекла");
    }

    void parse(Page page) {
        vector<Replace> replaces = getReplaces(page);
        if (replaces.empty()) {
            return;
        }

        cout << getTitleAligned(page.title) << endl;
        for (Replace replace : replaces) {
            cout << replace << endl;
            cout << endl;
        }
    }

    vector<Replace> getReplaces(Page page) {
        vector<Replace> infos;
        u32string text = to32(page.text);
        u32string textLower = tolower(text);
        size_t textEnd = getSectionsStart(text, textLower);
        ReplaceChecker checker(text, textLower);

        for (size_t i = 0; i < textEnd; ++i) {
            if (isRussian(text[i])) {
                for (size_t j = i; j <= text.length(); ++j) {
                    if (j == text.length() || !isRussian(text[j])) {
                        u32string word = text.substr(i, j - i);
                        auto it = dwords.find(word);
                        if (it != dwords.end()) {

                            if (j < text.length() && text[j] == U'.' && word.length() <= 5) {
                                // возможно это сокращение
                                if (!(j + 2 < text.length() && text[j + 1] == ' ' && isRussianUpper(text[j + 2]))) {
                                    i = j - 1;
                                    break;
                                }
                            }

                            u32string eword = it->second;
                            assert(eword.length() < MAX_LENGTH);
                            auto context = getWordContext(text, eword, i);
                            Replace replace(i, eword, context.first, context.second);
                            if (checker.check(replace.indexWordStart)) {
                                infos.push_back(replace);
                            }
                        }
                        i = j - 1;
                        break;
                    }
                }
            }
        }
        return infos;
    }
};

#endif //PARSE_REPLACES_CREATOR_H
