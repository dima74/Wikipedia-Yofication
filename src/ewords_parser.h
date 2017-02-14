#ifndef PARSE_EWORDS_PARSER_H
#define PARSE_EWORDS_PARSER_H

#include <bits/stdc++.h>
#include "txt_reader.h"
#include "u32string.h"
#include "word_info.h"
#include "string_helper.h"
using namespace std;

struct EwordsParser : public AbstractParser {
    // ключи --- dword
    map<u32string, DwordInfo> infos;

    void parse(Page page) {
        u32string text = to32(page.text);
        readWords(text, text.length(), [](const u32string &word, size_t i, size_t j, bool containsE) {
            if (containsE) {
                u32string dword = deefication(word);
                ++infos[dword].numbers[word];
            } else if (infos.find(word) != infos.end()) {
                ++infos[word].number;
            }
        });
    }

    virtual ~EwordsParser() {}
};

#endif //PARSE_EWORDS_PARSER_H
