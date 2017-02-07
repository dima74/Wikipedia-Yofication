#ifndef PARSE_PAGE_H
#define PARSE_PAGE_H

#include <bits/stdc++.h>
using namespace std;

// Format:
// <title>
// <revision>
// <number lines in text>
// <text>

struct Page {
    string title;
    size_t revision;
    string text;

    friend ostream &operator<<(ostream &out, Page page) {
        out << page.title << endl;
        out << page.revision << endl;
        out << (count(page.text.begin(), page.text.end(), '\n') + 1) << endl;
        cout << page.text << endl;
        return out;
    }

    friend istream &operator>>(istream &in, Page &page) {
        page = {};
        if (!getline(in, page.title)) {
            return in;
        }

        size_t number_lines;
        in >> page.revision >> number_lines;
        string line;
        getline(in, line); // считает пустую строку, ибо number_lines занимало всю строку
        assert(line.empty());
        for (int i = 0; i < number_lines; ++i) {
            getline(in, line);
            page.text += line + "\n";
        }
        page.text.pop_back();
        return in;
    }
};

#endif //PARSE_PAGE_H
