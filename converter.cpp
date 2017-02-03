#include <bits/stdc++.h>
#include "string_helper.h"
using namespace std;

const string title_start = "    <title>";
const string title_end = "</title>";
const string id_start = "      <id>";
const string id_end = "</id>";
const string text_start = "      <text xml:space=\"preserve\">";
const string text_end = "</text>";

int main() {
//    ifstream in("ruwiki-pages-articles.xml");
//    ofstream out("results/ruwiki-my.txt");
//    auto &out = cout;
//    out format:
//    <title>
//    <id>
//    <number lines in text>
//    <text>

    string line;
    string title;
    string id;
    while (getline(cin, line)) {
        if (starts_with(line, title_start)) {
            title = line.substr(title_start.length(), line.length() - title_start.length() - title_end.length());
        } else if (starts_with(line, id_start)) {
            id = line.substr(id_start.length(), line.length() - id_start.length() - id_end.length());
        } else if (starts_with(line, text_start)) {
            assert(!title.empty());
            assert(!id.empty());
            vector<string> text = {line.substr(text_start.length())};
            while (!ends_with(text.back(), text_end)) {
                getline(cin, line);
                text.push_back(line);
            }
            text.back() = text.back().substr(0, text.back().length() - text_end.length());
            while (!text.empty() && text.front().empty()) {
                text.erase(text.begin());
            }
            while (!text.empty() && text.back().empty()) {
                text.pop_back();
            }

            if (title.find(':') == string::npos) {
                cout << title << endl;
                cout << id << endl;
                cout << text.size() << endl;
                for (string text_line : text) {
                    cout << text_line << endl;
                }
            }
            title.clear();
        }
    }
    return 0;
}