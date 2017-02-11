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
        for (size_t i = 0; i < text.length(); ++i) {
            if (isRussian(text[i])) {
                bool containsE = false;
                for (size_t j = i; j <= text.length(); ++j) {
                    containsE |= isE(text[j]);
                    if (j == text.length() || !isRussianInText(text, j)) {
                        u32string word = text.substr(i, j - i);
                        if (containsE) {
                            u32string dword = deefication(word);
                            ++infos[dword].numbers[word];
                        } else if (infos.find(word) != infos.end()) {
                            ++infos[word].number;
                        }
                        i = j - 1;
                        break;
                    }
                }
            }
        }
    }

    virtual ~EwordsParser() {}
};

#endif //PARSE_EWORDS_PARSER_H
