#include <bits/stdc++.h>
#include "u32string.h"
#include "string_helper.h"
#include "colors.h"
#include "page.h"
#include "txt_reader.h"
#include "word_info.h"
#include "wikipedia_api.h"
using namespace std;

void nop() {}

const size_t MAX_WIDTH = 120;

struct ReplaceInfo {
    size_t start_word;
    u32string eword;
    u32string sentence0;
    u32string sentence1;

    ReplaceInfo(size_t start_word, const u32string &eword, const u32string &sentence0, const u32string &sentence1) : start_word(start_word), eword(eword), sentence0(sentence0), sentence1(sentence1) {}

    u32string getWord(u32string text) {
        return text.substr(start_word, eword.length());
    }
};

struct SentencesParser : public AbstractParser {
//    dword -> eword
    map<u32string, u32string> right;

    SentencesParser() {
        ifstream in("results/frequencies.txt");

        int number_words = 1000;
        int iword = 0;
        EwordInfo info;
        while (in >> info && iword < number_words) {
            if (isRussianLower(info.eword[0])) {
                right[deefication(info.eword)] = info.eword;
                ++iword;
            }
        }
    }

    void parse(Page page) {
        vector<ReplaceInfo> infos = getReplaces(page);
        if (infos.empty()) {
            return;
        }

        string titleToPrint = "==  " + page.title + "  ==";
        cout << u32string((MAX_WIDTH - to32(titleToPrint).length()) / 2, U' ') << titleToPrint << endl;

        u32string text = to32(page.getText());
        for (ReplaceInfo info : infos) {
            cout << info.sentence0 << cyan << info.getWord(text) << def << info.sentence1 << endl;
            cout << info.sentence0 << cyan << info.eword << def << info.sentence1 << endl;
            cout << endl;
        }
    }

    vector<ReplaceInfo> getReplaces(Page page) {
        vector<ReplaceInfo> infos;
        u32string text = to32(page.getText());
        for (size_t i = 0; i < text.length(); ++i) {
            if (isRussian(text[i])) {
                bool containsE = false;
                for (size_t j = i; j <= text.length(); ++j) {
                    containsE |= isE(text[j]);
                    if (j == text.length() || !isRussian(text[j])) {
                        u32string word = text.substr(i, j - i);
                        auto it = right.find(word);
                        if (it != right.end()) {
                            u32string eword = it->second;
                            assert(eword.length() < MAX_WIDTH);
                            size_t length = eword.length();
                            size_t length0 = (MAX_WIDTH - length) / 2;
                            size_t length1 = MAX_WIDTH - length0 - length;
                            u32string sentence0 = text.substr(max((size_t) 0, i - length0), length0);
                            u32string sentence1 = text.substr(i + length, length1);

                            sentence0 = sentence0.substr(sentence0.rfind(U'\n') + 1);
                            sentence1 = sentence1.substr(0, sentence1.find(U'\n'));

                            sentence0 = u32string(length0 - sentence0.length(), U' ') + sentence0;
                            sentence1 += u32string(length1 - sentence1.length(), U' ');

                            infos.emplace_back(i, eword, sentence0, sentence1);
                        }
                        i = j - 1;
                        break;
                    }
                }
            }
        }
        return infos;
    }
};

struct Interactive : public AbstractParser {
    SentencesParser parser;
    WikipediaApi api;

    void parse(Page page) {
        vector<ReplaceInfo> infos = parser.getReplaces(page);
        if (infos.empty()) {
            return;
        }

        size_t revision = api.getPageRevision(page.title);
        if (page.revision != revision) {
            cout << format("Пропускается {}, потому что появилась новая версия (локальная ревизия {}, последняя {})", page.title, page.revision, revision) << endl;
            return;
        }

//        TODO
//        if (api.isPageGuarded(page.title)) {
//            cout << format("Пропускается {}, так как она защищена", page.title) << endl;
//            return;
//        }

        string titleToPrint = "==  " + page.title + "  ==";
        cout << u32string((MAX_WIDTH - to32(titleToPrint).length()) / 2, U' ') << titleToPrint << endl;

        string u8text = page.getText();
        u32string text = to32(u8text);
        u32string textReplaced = text;
        bool replaceSomething = false;
        for (ReplaceInfo info : infos) {
            cout << info.sentence0 << cyan << info.getWord(text) << def << info.sentence1 << endl;
            cout << info.sentence0 << cyan << info.eword << def << info.sentence1 << endl;
            cout << endl;

            string confirm;
            getline(cin, confirm);
            cout << confirm.length() << " " << confirm << endl;
            if (confirm.empty()) {
                // согласие
                replaceSomething = true;
                textReplaced.replace(info.start_word, info.eword.length(), info.eword);
            }
        }

        if (replaceSomething) {
            api.changePage(page.title, u8text, to8(textReplaced), page.revision);
        }
    }
};

void createSentences() {
    SentencesParser parser;
    TxtReader().readTo(parser, 1000);
}

void interactive() {
    Interactive interactive;
    TxtReader().readTo(interactive, 1000);
}

int main() {
    interactive();
    return 0;
}