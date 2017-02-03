#include <bits/stdc++.h>
#include "u32string.h"
#include "string_helper.h"
#include "colors.h"
#include "page.h"
using namespace std;

void nop() {}

// dword --- деёфицированное слово
// eword --- слово с ё

struct WordInfoBest {
    u32string eword;
    size_t number;
    size_t numberAll;

    float getFrequency() {
        return number / (float) numberAll;
    }

    bool operator<(WordInfoBest info) {
        return getFrequency() > info.getFrequency();
    }
};

ostream &operator<<(ostream &out, WordInfoBest info) {
    return out << info.eword << " " << info.number << " " << info.numberAll;
}

istream &operator>>(istream &in, WordInfoBest &info) {
    in >> info.eword >> info.number >> info.numberAll;
}

struct WordInfo {
    size_t number = 0;
    // ключи --- eword
    map<u32string, size_t> numbers;

    size_t getNumberAll() {
        size_t numberAll = number;
        for (auto p : numbers) {
            numberAll += p.second;
        }
        return numberAll;
    }

    WordInfoBest getBest() {
        vector<pair<size_t, u32string>> numbers_v;
        for (auto p : numbers) {
            numbers_v.emplace_back(p.second, p.first);
        }

        sort(numbers_v.begin(), numbers_v.end());
        reverse(numbers_v.begin(), numbers_v.end());

        auto best = numbers_v[0];
        return {best.second, best.first, getNumberAll()};
    }
};

struct AbstractParser {
    virtual void parse(Page page) = 0;

    virtual ~AbstractParser() {}
};

struct FrequenciesParser : public AbstractParser {
    // ключи --- dword
    map<u32string, WordInfo> infos;

    void parse(Page page) {
        u32string text = to32(page.getText());
        for (size_t i = 0; i < text.length(); ++i) {
            if (isRussian(text[i])) {
                bool containsE = false;
                for (size_t j = i; j <= text.length(); ++j) {
                    containsE |= isE(text[j]);
                    if (j == text.length() || !isRussian(text[j])) {
                        u32string word = text.substr(i, j - i);
                        if (containsE) {
                            u32string dword = deefication(word);
                            ++infos[dword].numbers[word];
                        } else if (infos.find(word) != infos.end()) {
                            ++infos[word].number;
                        }
                        i = j - 1;
                        break;
                    }
                }
            }
        }
    }

    void summary() {
        vector<WordInfoBest> bests;
        for (pair<u32string, WordInfo> p : infos) {
            WordInfoBest best = p.second.getBest();
            if (best.number != best.numberAll) {
                bests.push_back(best);
            }
        }
        sort(bests.begin(), bests.end());
        for (WordInfoBest best : bests) {
            cout << best << endl;
        }
    }
};

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

struct TitlesParser : public AbstractParser {
    void parse(Page page) {
        cout << page.title << endl;
    }
};

struct TxtReader {
    ifstream in = ifstream("results/ruwiki-my.txt");

    void readTo(AbstractParser &parser, int number_pages = -1) {
        Page page;
        int ipage = 0;
        while ((in >> page) && (number_pages == -1 || ipage++ < number_pages)) {
            parser.parse(page);
        }
    }
};

void createFrequencies() {
    freopen("results/frequencies.txt", "w", stdout);
    FrequenciesParser parser;
    TxtReader().readTo(parser);
    parser.summary();
}

void createSentences() {
    SentencesParser parser;
    TxtReader().readTo(parser, 1000);
    parser.summary();
}

void createAllTitles() {
    freopen("results/all_titles.txt", "w", stdout);
    TitlesParser parser;
    TxtReader().readTo(parser);
}

int main() {
//    createFrequencies();
    createSentences();
//    createAllTitles();
    return 0;
}