#include <bits/stdc++.h>
#include "string_helper.h"
#include "page.h"
using namespace std;

const string titleStart = "    <title>";
const string titleEnd = "</title>";
const string revisionIdStart = "      <id>";
const string revisionIdEnd = "</id>";
const string namespaceStart = "    <ns>";
const string namespaceEnd = "</ns>";
const string textStart = "      <text xml:space=\"preserve\">";
const string textEnd = "</text>\n";

void normalize(string &text) {
    replaceAll(text, "&lt;", "<");
    replaceAll(text, "&gt;", ">");
    replaceAll(text, "&quot;", "\"");
    replaceAll(text, "&amp;", "&");
}

int main() {
//    freopen("xmls/ruwiki-pages-articles.xml", "r", stdin);
//    freopen("results/ruwiki-my.txt", "w", stdout);
    string line;
    Page page;
    string namespace_;
    while (getline(cin, line)) {
        if (startsWith(line, titleStart)) {
            page.title = line.substr(titleStart.length(), line.length() - titleStart.length() - titleEnd.length());
        } else if (startsWith(line, revisionIdStart)) {
            page.revision = stoull(line.substr(revisionIdStart.length(), line.length() - revisionIdStart.length() - revisionIdEnd.length()));
        } else if (startsWith(line, namespaceStart)) {
            namespace_ = line.substr(namespaceStart.length(), line.length() - namespaceStart.length() - namespaceEnd.length());
        } else if (startsWith(line, textStart)) {
            assert(!page.title.empty());
            assert(!namespace_.empty());

            string text = line.substr(textStart.length());
            while (!endsWith(text, textEnd)) {
                getline(cin, line);
                text += line + "\n";
            }

            if (namespace_ == "0") {
                text = text.substr(0, text.length() - textEnd.length());
                normalize(text);
                normalize(page.title);
                page.text = text;
                cout << page;
            }
            page = {};
        }
    }
    return 0;
}