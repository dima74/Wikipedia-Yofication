#ifndef PARSE_EWORDS_PARSER_H
#define PARSE_EWORDS_PARSER_H

#include <bits/stdc++.h>
#include "txt_reader.h"
#include "u16string.h"
#include "word_info.h"
#include "string_helper.h"
using namespace std;

struct EwordsParser : public AbstractParser {
    // ключи --- dword
    map<u16string, DwordInfo> infos;

    bool parse(Page page) {
        u16string text = to16(page.text);
        TxtReader::readWords(text, text.length(), [&](const u16string &word, size_t i, size_t j, bool containsE) {
            if (containsE) {
                u16string dword = deefication(word);
                ++infos[dword].numbers[word];
            } else if (infos.find(word) != infos.end()) {
                ++infos[word].number;
            }
        });
        return true;
    }

    virtual ~EwordsParser() {}
};

#endif //PARSE_EWORDS_PARSER_H
