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
//    dword -> eword
    map<u32string, u32string> right;
    set<char32_t> boundChars;

    SentencesParser() {
        ifstream in("results/frequencies.txt");

        int number_words = 10;
        int iword = 0;
        WordInfoBest info;
        while (in >> info && iword++ < number_words) {
            right[deefication(info.eword)] = info.eword;
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

                            size_t sentenceStart = i;
                            size_t sentenceEnd = j;
                            while (sentenceStart > 0 && isSentence(text[sentenceStart - 1])) {
                                --sentenceStart;
                            }
                            while (sentenceEnd < text.length() && isSentence(text[sentenceEnd])) {
                                ++sentenceEnd;
                            }

                            if (sentenceStart > 0) {
                                boundChars.insert(text[sentenceStart - 1]);
                            }
                            if (sentenceEnd < text.length()) {
                                boundChars.insert(text[sentenceEnd]);
                            }

                            if (!printTitle) {
                                cout << "==  " << page.title << "  ==" << endl;
                                printTitle = true;
                            }
                            u32string sentence0 = text.substr(sentenceStart, i - sentenceStart);
                            u32string sentence1 = text.substr(j, sentenceEnd - j);
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

    void summary() {
        cout << "==  Summary  ==" << endl;
        boundChars.erase('\n');
        for (char32_t c : boundChars) {
            cout << c;
        }
        cout << endl;
    }
};

void createSentences() {
    SentencesParser parser;
    TxtReader().readTo(parser, 1000);
    parser.summary();
}

int main() {
    WikipediaApi api;
    string title = BOT_PAGE + "/тест6";
    size_t revision = api.createPage(title, "1");
    api.changePage(title, "2", revision);
    return 0;
}