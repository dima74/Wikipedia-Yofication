#include <bits/stdc++.h>
#include "txt_reader.h"
#include "replaces_creator.h"
using namespace std;
#include "../lib/json.hpp"
using json = nlohmann::json;

struct ReplacesPrinter : public AbstractParser {
    ReplacesCreator replacesCreator;
    size_t numberPages = 0;

    void createPagesToEfication(const Page &page) {
        ofstream out("replaces/pagesToEfication/" + to_string(numberPages));
        assert(out);
        out << page.title;
    }

    void createReplacesByTitles(const Page &page, const vector<Replace> &replaces) {
        ofstream out("replaces/replacesByTitles/" + page.title);
        assert(out);
        json info;
        info["title"] = page.title;
        info["revision"] = page.revision;

        json replacesJson = json::array();
        u16string text16 = to16(page.text);
        for (Replace replace : replaces) {
            u16string dword = text16.substr(replace.indexWordStart, replace.eword.length());
            size_t numberSameDwordsBefore = getNumberMatches(text16, dword, 0, replace.indexWordStart);
            size_t numberSameDwords = getNumberMatches(text16, dword);
            json replaceJson;
            replaceJson["indexWordStart"] = replace.indexWordStart;
            replaceJson["eword"] = to8(replace.eword);
            replaceJson["numberSameDwordsBefore"] = numberSameDwordsBefore;
            replaceJson["numberSameDwords"] = numberSameDwords;
            replaceJson["frequency"] = lround(replacesCreator.ewords[replace.eword].getFrequency() * 100);
            replacesJson.push_back(replaceJson);
        }
        info["replaces"] = replacesJson;

        out << info << endl;
    }

    bool parse(Page page) {
        vector<Replace> replaces = replacesCreator.getReplaces(page);
        if (replaces.empty()) {
            return false;
        }
        createPagesToEfication(page);
        createReplacesByTitles(page, replaces);
        ++numberPages;
        return true;
    }
};

void printReplaces(int numberPages, size_t numberPagesToSkip = 0) {
    freopen("results/ruwiki-my.txt", "r", stdin);

    ofstream out("replaces/numberPages");
    out << numberPages << endl;

    ReplacesPrinter printer;
    TxtReader().readTo(printer, numberPages, numberPagesToSkip);
}

int main() {
    printReplaces(100, 1000);
    return 0;
}
