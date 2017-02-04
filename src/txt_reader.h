#ifndef PARSE_TXT_READER_H
#define PARSE_TXT_READER_H

#include <bits/stdc++.h>
#include "page.h"
using namespace std;

struct AbstractParser {
    virtual void parse(Page page) = 0;

    virtual ~AbstractParser() {}
};

struct TxtReader {
    ifstream in = ifstream("results/ruwiki-my.txt");

    void readTo(AbstractParser &parser, int number_pages = -1) {
        Page page;
        int ipage = 0;
        while ((in >> page) && (number_pages == -1 || ipage++ < number_pages)) {
            parser.parse(page);
        }
    }
};

#endif //PARSE_TXT_READER_H
