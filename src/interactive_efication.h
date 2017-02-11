#ifndef PARSE_INTERACTIVE_EFICATION_H
#define PARSE_INTERACTIVE_EFICATION_H

#include <bits/stdc++.h>
#include "txt_reader.h"
#include "wikipedia_api.h"
#include "replaces_creator.h"
#include "clipboard.h"
using namespace std;

struct InteractiveEfication : public AbstractParser {
    SentencesParser parser;
    WikipediaApi api;

    void parse(Page page) {
        vector<ReplaceInfo> infos = parser.getReplaces(page);
        if (infos.empty()) {
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
            infos = parser.getReplaces(page);
            if (infos.empty()) {
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
        cout << getPageUrl(page.title) << endl;

        string u8text = page.text;
        u32string text = to32(u8text);
        u32string textReplaced = text;
        bool replaceSomething = false;
        for (ReplaceInfo info : infos) {
            cout << info.sentence0 << cyan << info.eword << def << info.sentence1 << endl;
            size_t copyLength = 10;
            copy(to8(info.sentence0.substr(info.sentence0.length() - copyLength) + info.eword + info.sentence1.substr(0, copyLength)));

            string confirm;
            getline(cin, confirm);
            if (confirm.empty()) {
                // согласие
                replaceSomething = true;
                textReplaced.replace(info.start_word, info.eword.length(), info.eword);
            }
        }

        if (replaceSomething) {
            assert(text != textReplaced);
            api.changePage(page, remotePage, to8(textReplaced));
        }
    }
};

void interactive() {
    InteractiveEfication interactive;
    TxtReader().readTo(interactive, 1000);
}

#endif //PARSE_INTERACTIVE_EFICATION_H
