#include <bits/stdc++.h>
#include "txt_reader.h"
#include "replaces_creator.h"
using namespace std;
#include "../lib/json.hpp"
using json = nlohmann::json;

struct ReplacesPrinter : public AbstractParser {
    ReplacesCreator replacesCreator;
    size_t numberPages = 0;

    bool parse(Page page) {
        vector<Replace> replaces = replacesCreator.getReplaces(page);
        if (replaces.empty()) {
            return false;
        }

        ofstream out("replaces/" + to_string(numberPages++));
        assert(out);
        json info;
        info["title"] = page.title;
        info["revision"] = page.revision;

        json replacesJson = json::array();
        for (Replace replace : replaces) {
            string eword = to8(replace.eword);
            string dword = page.text.substr(replace.indexWordStart, eword.length());
            size_t numberSameEwordsBefore = getNumberMatches(page.text, dword, 0, replace.indexWordStart);
            json replaceJson;
            replaceJson["indexWordStart"] = replace.indexWordStart;
            replaceJson["eword"] = eword;
            replaceJson["numberSameEwordsBefore"] = numberSameEwordsBefore;
            replacesJson.push_back(replaceJson);
        }
        info["replaces"] = replacesJson;

        out << info << endl;
        return true;
    }
};

void printReplaces(int numberPages) {
    freopen("results/ruwiki-my.txt", "r", stdin);

    ofstream out("replaces/numberPages");
    out << numberPages << endl;

    ReplacesPrinter printer;
    TxtReader().readTo(printer, numberPages);
}

int main() {
    printReplaces(10);
    return 0;
}