#include <bits/stdc++.h>
#include "string_helper.h"
#include "/home/dima/C++/debug.h"
using namespace std;

const string page = "  <page>";
const string title_start = "    <title>";
const string title_end = "</title>";
const string text_start = "      <text xml:space=\"preserve\">";
const string text_end = "</text>";

int main() {
    ifstream in("ruwiki-pages-articles.xml");
    ofstream out("results/ruwiki-my.txt");
//    auto &out = cout;
//    out format:
//    <title>
//    <number lines in text>
//    <text>

//    3849882 pages
//    3849746 pages with text

    string line;
    string title;
    size_t number_titles = 0;
    size_t number_texts = 0;
    while (getline(in, line)) {
        if (starts_with(line, title_start)) {
            ++number_titles;
            title = line.substr(title_start.length(), line.length() - title_start.length() - title_end.length());
        } else if (starts_with(line, text_start)) {
            ++number_texts;
            assert(!title.empty());
            vector<string> text = {line.substr(text_start.length())};
            while (!ends_with(text.back(), text_end)) {
                getline(in, line);
                text.push_back(line);
            }
            text.back() = text.back().substr(0, text.back().length() - text_end.length());
            while (!text.empty() && text.front().empty()) {
                text.erase(text.begin());
            }
            while (!text.empty() && text.back().empty()) {
                text.pop_back();
            }

            out << title << endl;
            out << text.size() << endl;
            for (string text_line : text) {
                out << text_line << endl;
            }
            title.clear();
        }
    }
    dbg(number_titles);
    dbg(number_texts);
    return 0;
}