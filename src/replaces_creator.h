#ifndef PARSE_REPLACES_CREATOR_H
#define PARSE_REPLACES_CREATOR_H

#include <bits/stdc++.h>
#include "txt_reader.h"
#include "page.h"
#include "word_info.h"
#include "string_helper.h"
#include "alignment.h"
#include "colors.h"
using namespace std;

struct ReplaceInfo {
    size_t start_word;
    u32string eword;
    u32string sentence0;
    u32string sentence1;

    ReplaceInfo(size_t start_word, const u32string &eword, const u32string &sentence0, const u32string &sentence1) : start_word(start_word), eword(eword), sentence0(sentence0), sentence1(sentence1) {}

    u32string getWord(u32string text) {
        return text.substr(start_word, eword.length());
    }
};

struct SentencesParser : public AbstractParser {
//    dword -> eword
    map<u32string, u32string> right;

    SentencesParser() {
        ifstream in("results/frequencies.txt");
        assert(in);

        EwordInfo info;
        while (in >> info && info.getFrequency() > .5) {
            if (isRussianLower(info.eword[0])) {
                right[deefication(info.eword)] = info.eword;
            }
        }
    }

    void parse(Page page) {
        vector<ReplaceInfo> infos = getReplaces(page);
        if (infos.empty()) {
            return;
        }

        cout << getTitleAligned(page.title) << endl;

        u32string text = to32(page.text);
        for (ReplaceInfo info : infos) {
            cout << info.sentence0 << cyan << info.getWord(text) << def << info.sentence1 << endl;
            cout << info.sentence0 << cyan << info.eword << def << info.sentence1 << endl;
            cout << endl;
        }
    }

    vector<ReplaceInfo> getReplaces(Page page) {
        vector<ReplaceInfo> infos;
        u32string text = to32(page.text);
        u32string textLower = tolower(text);

        size_t textEnd = text.length();
        const vector<u32string> excludeSections = {U"литература", U"ссылки", U"примечания"};
        for (u32string excludeSection : excludeSections) {
            textEnd = min(textEnd, findSection(textLower, excludeSection));
        }

        vector<pair<vector<u32string>, vector<u32string>>> excludes = {
                {{U"<nowiki",         U"<Nowiki",      U"<NOWIKI"},             {U"/nowiki>",       U"/Nowiki>",      U"/NOWIKI>"}},
                {{U"<ref",            U"<Ref",         U"<REF"},                {U"/ref>",          U"/Ref>",         U"/REF>", U"/>"}},
                {{U"{{начало цитаты", U"{{Начало цитаты"},                      {U"{{конец цитаты", U"{{Конец цитаты"}},
                {{U"<!--"},                                                     {U"-->"}},
                {{U"{{цитата",        U"{{Цитата",     U"{{quote", U"{{Quote"}, {U"}}"}},
                {{U"<blockquote>",    U"<Blockquote>", U"<BLOCKQUOTE>"},        {U"</blockquote>",  U"</Blockquote>", U"</BLOCKQUOTE>"}},
                {{U"«"},                                                        {U"»"}}
        };
        map<size_t, size_t> mapExcludes;
        for (auto exclude : excludes) {
            size_t start_position = 0;
            while ((start_position = findFirst(text, exclude.first, start_position)) != string::npos) {
                size_t end_position = findFirst(text, exclude.second, start_position);
                mapExcludes[start_position] = end_position;
                assert(end_position != string::npos);
                start_position = end_position;
            }
        }

        for (size_t i = 0; i < textEnd; ++i) {
            auto itExclude = mapExcludes.find(i);
            if (itExclude != mapExcludes.end()) {
                i = itExclude->second;
                continue;
            }

            if (isRussian(text[i])) {
                for (size_t j = i; j <= text.length(); ++j) {
                    if (j == text.length() || !isRussian(text[j])) {
                        u32string word = text.substr(i, j - i);
                        auto it = right.find(word);
                        if (it != right.end()) {

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
                            infos.emplace_back(i, eword, context.first, context.second);
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
