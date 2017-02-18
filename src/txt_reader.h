#ifndef PARSE_TXT_READER_H
#define PARSE_TXT_READER_H

#include <bits/stdc++.h>
#include "page.h"
#include "string_helper.h"
using namespace std;

struct AbstractParser {
    virtual bool parse(Page page) = 0;

    virtual ~AbstractParser() {}
};

struct TxtReader {
    ifstream in = ifstream("results/ruwiki-my.txt");

    TxtReader() {
        assert(in);
    }

    void readTo(AbstractParser &parser, int numberPages = -1, size_t numberPagesToSkip = 0) {
        readToLambda([&parser](Page page) { return parser.parse(page); }, numberPages, numberPagesToSkip);
    }

    template<typename Lambda>
    void readToLambda(Lambda lambda, int numberPages = -1, size_t numberPagesToSkip = 0) {
        Page page;
        int ipage = 0;
        for (int i = 0; i < numberPagesToSkip; ++i) {
            in >> page;
        }
        while ((in >> page) && (numberPages == -1 || ipage < numberPages)) {
            ipage += lambda(page);
        }
    }

    template<typename Lambda>
    static void readWords(const u16string &text, size_t textEnd, Lambda lambda) {
        for (size_t i = 0; i < textEnd; ++i) {
            if (isRussian(text[i])) {
                bool containsE = false;
                for (size_t j = i; j <= textEnd; ++j) {
                    containsE |= isE(text[j]);
                    if (j == textEnd || !isRussianInText(text, j)) {
                        char16_t prevChar = i == 0 ? 0 : text[i - 1];
                        char16_t nextChar = j == textEnd ? 0 : text[j];
                        if (!isRussianDelimiter(prevChar) && !isRussianDelimiter(nextChar) && prevChar != u']' /* исключение слов вида "[[год]]у" */) {
                            u16string word = text.substr(i, j - i);
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
