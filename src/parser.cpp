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

struct SentencesParser : public AbstractParser {
    const size_t MAX_WIDTH = 120;

//    dword -> eword
    map<u32string, u32string> right;

    SentencesParser() {
        ifstream in("results/frequencies.txt");

        int number_words = 100;
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
        bool printTitle = false;
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

                            if (!printTitle) {
                                string titleToPrint = "==  " + page.title + "  ==";
                                cout << u32string((MAX_WIDTH - to32(titleToPrint).length()) / 2, U' ') << titleToPrint << endl;
                                printTitle = true;
                            }
                            cout << sentence0 << cyan << word << def << sentence1 << endl;
                            cout << sentence0 << cyan << eword << def << sentence1 << endl;
                            cout << endl;
                        }
                        i = j - 1;
                        break;
                    }
                }
            }
        }
    }
};

void createSentences() {
    SentencesParser parser;
    TxtReader().readTo(parser, 1000);
}

int main() {
//    WikipediaApi api;
//    string title = BOT_PAGE + "/тест6";
//    size_t revision = api.createPage(title, "1");
//    api.changePage(title, "2", revision);

    createSentences();
    return 0;
}