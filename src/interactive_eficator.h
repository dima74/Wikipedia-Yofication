#ifndef PARSE_INTERACTIVE_EFICATOR_H
#define PARSE_INTERACTIVE_EFICATOR_H

#include <bits/stdc++.h>
#include "txt_reader.h"
#include "wikipedia_api.h"
#include "replaces_creator.h"
#include "replaces_exclusion.h"
using namespace std;

void copyToClipboard(string text) {
    int rc = system(("echo -n '" + text + "' | xclip -selection clipboard").c_str());
    assert(rc == 0);
}

u16string getSmallWordContext(const u16string &text, Replace replace) {
    const size_t copyLength = 10;
    const u16string forbidden = u"[]*{}<>#'|=\"\n";

    size_t length0 = min(copyLength, replace.indexWordStart);
    u16string context0 = text.substr(replace.indexWordStart - length0, length0);
    u16string context1 = text.substr(replace.indexWordStart + replace.eword.length(), copyLength);
    context0 = context0.substr(context0.find_last_of(forbidden) + 1);
    context1 = context1.substr(0, context1.find_first_of(forbidden));

    u16string context = context0 + replace.eword + context1;
    return context;
}

struct InteractiveEficator : public AbstractParser {
    ReplacesCreator replacesCreator;
    ReplacesExclusion replacesExclusion;
    WikipediaApi api;

    bool parse(Page page) {
        vector<Replace> replaces = replacesCreator.getReplaces(page, replacesExclusion.exclusions);
        if (replaces.empty()) {
            cout << "." << flush;
            return false;
        }

        RemotePage remotePage = api.getRemotePage(page.title);
        if (remotePage.protect) {
//            cout << format("Пропускается '{}', так как она защищена", page.title) << endl;
            cout << "." << flush;
            return false;
        }
        if (page.revision != remotePage.revision) {
            size_t oldRevision = page.revision;
            page.revision = remotePage.revision;
            page.text = remotePage.text;
            replaces = replacesCreator.getReplaces(page, replacesExclusion.exclusions);
            if (replaces.empty()) {
                cout << "." << flush;
                return false;
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
        u16string text = to16(u8text);
        u16string textReplaced = text;
        bool replaceSomething = false;
        for (Replace replace : replaces) {
            auto context = getWordContext(text, replace.eword, replace.indexWordStart);
            cout << context.first << cyan << replace.eword << def << context.second << endl;
            float frequency = replacesCreator.ewords[replace.eword].getFrequency();
            cout << green << lround(frequency * 100) << def << endl;
            copyToClipboard(to8(getSmallWordContext(text, replace)));

            string confirm;
            getline(cin, confirm);
            if (confirm.empty()) {
                // согласие
                replaceSomething = true;
                textReplaced.replace(replace.indexWordStart, replace.eword.length(), replace.eword);
            } else {
                replacesExclusion.exclude(replace.eword);
            }
        }

        if (replaceSomething) {
            assert(text != textReplaced);
            copyToClipboard("Отправляем изменения...");
            api.changePage(page, remotePage, to8(textReplaced));
            return true;
        }
        return false;
    }
};

void interactive() {
    InteractiveEficator interactive;
    TxtReader().readTo(interactive, 10);
}

#endif //PARSE_INTERACTIVE_EFICATOR_H
