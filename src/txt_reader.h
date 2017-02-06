#ifndef PARSE_TXT_READER_H
#define PARSE_TXT_READER_H

#include <bits/stdc++.h>
#include "page.h"
using namespace std;

struct AbstractParser {
    virtual void parse(Page page) = 0;

    virtual ~AbstractParser() {}
};

void replaceAll(string &source, string search, string replace) {
    size_t pos = 0;
    while ((pos = source.find(search, pos)) != string::npos) {
        source.replace(pos, search.length(), replace);
        pos += replace.length();
    }
}

void normalize(string &text) {
    replaceAll(text, "&lt;", "<");
    replaceAll(text, "&gt;", ">");
    replaceAll(text, "&quot;", "\"");
    replaceAll(text, "&amp;", "&");
}

struct TxtReader {
    ifstream in = ifstream("results/ruwiki-my.txt");

    void readTo(AbstractParser &parser, int number_pages = -1) {
        Page page;
        int ipage = 0;
        while ((in >> page) && (number_pages == -1 || ipage++ < number_pages)) {
            for (string &line : page.text) {
                normalize(line);
            }
            parser.parse(page);
        }
    }
};

#endif //PARSE_TXT_READER_H
