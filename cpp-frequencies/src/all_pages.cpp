#include <bits/stdc++.h>
#include "yowords_parser.h"
#include "replaces_creator.h"
#include "base.h"
using namespace std;

struct AllPagesPrinter : public AbstractParser {
    ReplacesCreator replacesCreator = {0.5};
    vector<pair<size_t, string>> pages;

    bool parse(Page page) {
        vector<Replace> replaces = replacesCreator.getReplaces(page);
        if (!replaces.empty()) {
            size_t number_replaces = replaces.size();
            pages.emplace_back(number_replaces, page.title);
        }
        return true;
    }

    void finish() {
        sort(pages.begin(), pages.end(), greater<>());
        for (auto entry : pages) {
            cout << entry.first << " " << entry.second << endl;
        }
    }
};

int main() {
//    freopen("results/ruwiki-my.txt", "r", stdin);
    AllPagesPrinter printer;
    TxtReader().readTo(printer);
    printer.finish();
    return 0;
}