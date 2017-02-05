#ifndef PARSE_PAGE_H
#define PARSE_PAGE_H

#include <bits/stdc++.h>
using namespace std;

// Format:
// <title>
// <id>
// <number lines in text>
// <text>

struct Page {
    string title;
    size_t id;
    vector<string> text;

    friend ostream &operator<<(ostream &out, Page page) {
        out << page.title << endl;
        out << page.id << endl;
        out << page.text.size() << endl;
        for (string text_line : page.text) {
            out << text_line << endl;
        }
        return out;
    }

    friend istream &operator>>(istream &in, Page &page) {
        page = {};
        if (!getline(in, page.title)) {
            return in;
        }

        size_t number_lines;
        in >> page.id >> number_lines;
        string line;
        getline(in, line); // считает пустую строку, ибо number_lines занимало всю строку
        assert(line.empty());
        for (int i = 0; i < number_lines; ++i) {
            getline(in, line);
            page.text.push_back(line);
        }
        return in;
    }

    string getText() {
        string ret;
        for (string line : text) {
            ret += line + "\n";
        }
        return ret;
    }
};

#endif //PARSE_PAGE_H
