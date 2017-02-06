#include <bits/stdc++.h>
#include "string_helper.h"
#include "page.h"
using namespace std;

const string title_start = "    <title>";
const string title_end = "</title>";
const string revision_id_start = "      <id>";
const string revision_id_end = "</id>";
const string namespace_start = "    <ns>";
const string namespace_end = "</ns>";
const string text_start = "      <text xml:space=\"preserve\">";
const string text_end = "</text>";

int main() {
//    freopen("xmls/ruwiki-pages-articles.xml", "r", stdin);
//    freopen("results/ruwiki-my.txt", "w", stdout);
    string line;
    Page page;
    string namespace_;
    while (getline(cin, line)) {
        if (starts_with(line, title_start)) {
            page.title = line.substr(title_start.length(), line.length() - title_start.length() - title_end.length());
        } else if (starts_with(line, revision_id_start)) {
            page.revision = stoull(line.substr(revision_id_start.length(), line.length() - revision_id_start.length() - revision_id_end.length()));
        } else if (starts_with(line, namespace_start)) {
            namespace_ = line.substr(namespace_start.length(), line.length() - namespace_start.length() - namespace_end.length());
        } else if (starts_with(line, text_start)) {
            assert(!page.title.empty());
            assert(!namespace_.empty());

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
            page.text = text;

            if (namespace_ == "0") {
                cout << page;
            }
            page = {};
        }
    }
    return 0;
}