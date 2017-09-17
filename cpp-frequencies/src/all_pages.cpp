#include <bits/stdc++.h>
#include "yowords_parser.h"
#include "replaces_creator.h"
#include "base.h"
using namespace std;

struct AllPagesPrinter : public AbstractParser {
    ReplacesCreator replacesCreator = {0.3};

    bool parse(Page page) {
        vector<Replace> replaces = replacesCreator.getReplaces(page);
        if (!replaces.empty()) {
            cout << page.title << endl;
        }
        return true;
    }
};

int main() {
//    freopen("results/ruwiki-my.txt", "r", stdin);
    AllPagesPrinter printer;
    TxtReader().readTo(printer);
    return 0;
}