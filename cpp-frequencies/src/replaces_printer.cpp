#include <bits/stdc++.h>
#include "txt_reader.h"
#include "replaces_creator.h"
#include "replaces_printer_helper.h"
#include "base.h"
using namespace std;

const string replacesFolder = "replaces/";
const string pagesToEficationFolder = replacesFolder + "pagesToEfication/";
const string replacesByTitlesFolder = replacesFolder + "replacesByTitles/";

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
        json info = convertReplacesToJson(replaces, page, replacesCreator);
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

    ReplacesPrinter printer;
    TxtReader().readTo(printer, numberPages, numberPagesToSkip);

    ofstream out(replacesFolder + "numberPages");
    out << printer.numberPages << endl;
}

int main() {
    printReplaces();
    return 0;
}
