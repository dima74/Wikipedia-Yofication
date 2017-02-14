#ifndef PARSE_TXT_READER_H
#define PARSE_TXT_READER_H

#include <bits/stdc++.h>
#include "page.h"
#include "string_helper.h"
using namespace std;

struct AbstractParser {
    virtual void parse(Page page) = 0;

    virtual ~AbstractParser() {}
};

struct TxtReader {
    ifstream in = ifstream("results/ruwiki-my.txt");

    TxtReader() {
        assert(in);
    }

    void readTo(AbstractParser &parser, int number_pages = -1) {
        readToLambda([&parser](Page page) { parser.parse(page); }, number_pages);
    }

    template<typename Lambda>
    void readToLambda(Lambda lambda, int number_pages = -1) {
        Page page;
        int ipage = 0;
        while ((in >> page) && (number_pages == -1 || ipage++ < number_pages)) {
            lambda(page);
        }
    }

    template<typename Lambda>
    static void readWords(const u32string &text, Lambda lambda) {
        for (size_t i = 0; i < text.length(); ++i) {
            if (isRussian(text[i])) {
                bool containsE = false;
                for (size_t j = i; j <= text.length(); ++j) {
                    containsE |= isE(text[j]);
                    if (j == text.length() || !isRussianInText(text, j)) {
                        char32_t prevChar = i == 0 ? 0 : text[i - 1];
                        char32_t nextChar = j == text.length() ? 0 : text[j];
                        if (!isRussianDelimiter(prevChar) && !isRussianDelimiter(nextChar) && prevChar != U']' /* исключение слов вида "[[год]]у" */) {
                            u32string word = text.substr(i, j - i);
                            lambda(word, i, j, containsE);
                        }
                        i = j - 1;
                        break;
                    }
                }
            }
        }
    }
};

#endif //PARSE_TXT_READER_H
