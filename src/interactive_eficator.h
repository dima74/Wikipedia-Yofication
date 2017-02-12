#ifndef PARSE_INTERACTIVE_EFICATOR_H
#define PARSE_INTERACTIVE_EFICATOR_H

#include <bits/stdc++.h>
#include "txt_reader.h"
#include "wikipedia_api.h"
#include "replaces_creator.h"
using namespace std;

void copyToClipboard(string text) {
    int rc = system(("echo -n '" + text + "' | xclip -selection clipboard").c_str());
    assert(rc == 0);
}

struct InteractiveEficator : public AbstractParser {
    ReplacesCreator replacesCreator;
    WikipediaApi api;

    void parse(Page page) {
        vector<Replace> replaces = replacesCreator.getReplaces(page);
        if (replaces.empty()) {
            cout << "." << flush;
            return;
        }

        RemotePage remotePage = api.getRemotePage(page.title);
        if (remotePage.protect) {
//            cout << format("Пропускается '{}', так как она защищена", page.title) << endl;
            cout << "." << flush;
            return;
        }
        if (page.revision != remotePage.revision) {
            size_t oldRevision = page.revision;
            page.revision = remotePage.revision;
            page.text = remotePage.text;
            replaces = replacesCreator.getReplaces(page);
            if (replaces.empty()) {
                cout << "." << flush;
                return;
            }
//            cout << format("Предупреждение: появилась новая версия '{}' (локальная ревизия {}, последняя {})", page.title, oldRevision, remotePage.revision) << endl;
        }
        cout << endl;

        if (remotePage.text != page.text) {
            cerr << page.title << endl;
            cerr << stringDiff(remotePage.text, page.text) << endl;
        }
        assert(remotePage.text == page.text);

        cout << getTitleAligned(page.title) << endl;

        string url = getPageUrl(page.title);
        cout << url << endl;
        copyToClipboard(url);
        string confirmUrl;
        getline(cin, confirmUrl);

        string u8text = page.text;
        u32string text = to32(u8text);
        u32string textReplaced = text;
        bool replaceSomething = false;
        for (Replace replace : replaces) {
            cout << replace << endl;
            cout << green << replacesCreator.ewords[replace.eword].getFrequency() << def << endl;

            size_t copyLength = 10;
            copyToClipboard(to8(replace.sentence0.substr(replace.sentence0.length() - copyLength) + replace.eword + replace.sentence1.substr(0, copyLength)));

            string confirm;
            getline(cin, confirm);
            if (confirm.empty()) {
                // согласие
                replaceSomething = true;
                textReplaced.replace(replace.indexWordStart, replace.eword.length(), replace.eword);
            }
        }

        if (replaceSomething) {
            assert(text != textReplaced);
            api.changePage(page, remotePage, to8(textReplaced));
        }
    }
};

void interactive() {
    InteractiveEficator interactive;
    TxtReader().readTo(interactive, 1000);
}

#endif //PARSE_INTERACTIVE_EFICATOR_H
