#include <bits/stdc++.h>
#include "txt_reader.h"
#include "replaces_creator.h"
#include "counter_number_russian_words.h"
using namespace std;
#include "../lib/json.hpp"
using json = nlohmann::json;

const string replacesFolder = "replaces/";
const string pagesToEficationFolder = replacesFolder + "pagesToEfication/";
const string replacesByTitlesFolder = replacesFolder + "replacesByTitles/";

int system(string command) {
    return system(command.c_str());
}

void mkdirs(string path) {
    system("mkdir -p " + path);
}

struct ReplacesPrinter : public AbstractParser {
    ReplacesCreator replacesCreator;
    size_t numberPages = 0;

    void createPagesToEfication(const Page &page) {
        ofstream out(pagesToEficationFolder + to_string(numberPages));
        assert(out);
        out << page.title;
    }

    void createReplacesByTitles(const Page &page, const vector<Replace> &replaces) {
        ofstream out(replacesByTitlesFolder + page.title);
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

            size_t numberSameDwordsBefore = CounterNumberRussianWords::getNumberRussianWords(text16, dword, 0, replace.indexWordStart);
            size_t numberSameDwords = CounterNumberRussianWords::getNumberRussianWords(text16, dword);
            assert(numberSameDwords > 0);
            json replaceJson;
            replaceJson["indexWordStart"] = replace.indexWordStart;
            replaceJson["eword"] = to8(eword);
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
    mkdirs(replacesFolder);
    mkdirs(pagesToEficationFolder);
    mkdirs(replacesByTitlesFolder);

    freopen("results/ruwiki-my.txt", "r", stdin);
    ReplacesPrinter printer;
    TxtReader().readTo(printer, numberPages, numberPagesToSkip);

    ofstream out(replacesFolder + "numberPages");
    out << printer.numberPages << endl;
}

int main() {
    setlocale(LC_ALL, "ru_RU.UTF-8");
    printReplaces();
    return 0;
}
