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
            size_t length = replace.eword.length();
            if (replace.indexWordStart == 0 || replace.indexWordStart + length == text16.length()) {
                continue;
            }

            u16string eword = replace.eword;
            u16string dword = text16.substr(replace.indexWordStart, length);
            u16string ewordContext = text16[replace.indexWordStart - 1] + eword + text16[replace.indexWordStart + length];
            u16string dwordContext = text16[replace.indexWordStart - 1] + dword + text16[replace.indexWordStart + length];

            size_t numberSameDwordsBefore = getNumberMatches(text16, dwordContext, 0, replace.indexWordStart - 1);
            size_t numberSameDwords = getNumberMatches(text16, dwordContext);
            json replaceJson;
            replaceJson["indexWordStart"] = replace.indexWordStart;
            replaceJson["eword"] = to8(ewordContext);
            replaceJson["numberSameDwordsBefore"] = numberSameDwordsBefore;
            replaceJson["numberSameDwords"] = numberSameDwords;
            replaceJson["frequency"] = lround(replacesCreator.ewords[eword].getFrequency() * 100);
            replacesJson.push_back(replaceJson);
        }
        info["replaces"] = replacesJson;

        out << info << endl;
    }

    bool parse(Page page) {
        vector<Replace> replaces = replacesCreator.getReplaces(page);
        if (replaces.empty() || page.title.find(u'/') != string::npos) {
            return false;
        }
        createPagesToEfication(page);
        createReplacesByTitles(page, replaces);
        ++numberPages;
        return true;
    }
};

void printReplaces(int numberPages = -1, size_t numberPagesToSkip = 0) {
    freopen("results/ruwiki-my.txt", "r", stdin);

    ReplacesPrinter printer;
    TxtReader().readTo(printer, numberPages, numberPagesToSkip);

    ofstream out("replaces/numberPages");
    out << printer.numberPages << endl;
}

int main() {
    setlocale(LC_ALL, "ru_RU.UTF-8");
    printReplaces();
    return 0;
}
