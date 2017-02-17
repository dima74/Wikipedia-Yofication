#include <bits/stdc++.h>
#include "txt_reader.h"
#include "replaces_creator.h"
using namespace std;

struct ReplacesPrinter : public AbstractParser {
    ReplacesCreator replacesCreator;
    size_t numberPages = 0;

    bool parse(Page page) {
        vector<Replace> replaces = replacesCreator.getReplaces(page);
        if (replaces.empty()) {
            return false;
        }

        freopen(("replaces/" + to_string(numberPages++)).c_str(), "w", stdout);
        cout << page.title << endl;
        cout << page.revision << endl;
        cout << replaces.size() << endl;
        for (Replace replace : replaces) {
            size_t numberSameEwordsBefore = getNumberMatches(page.text, to8(replace.eword), 0, replace.indexWordStart);
            cout << replace.eword << " " << replace.indexWordStart << " " << numberSameEwordsBefore << endl;
        }
        return true;
    }
};

int main() {
    freopen("results/ruwiki-my.txt", "r", stdin);
    ReplacesPrinter printer;
    TxtReader().readTo(printer, 10);
    return 0;
}