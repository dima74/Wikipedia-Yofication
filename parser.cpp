#include <bits/stdc++.h>
#include "u32string.h"
#include "string_helper.h"
#include "/home/dima/C++/debug.h"
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

struct WikipediaParser {
    // ключи --- dword
    map<u32string, WordInfo> infos;

    void parse(string title, string text_s) {
        u32string text = to32(text_s);
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

struct TxtParser {
    ifstream in = ifstream("ruwiki-my.txt");
    WikipediaParser parser;

    void parse() {
        string title;
        int number_pages = 10000;
        int ipage = 0;
        while (getline(in, title) && ipage++ < number_pages) {
            size_t number_lines;
            in >> number_lines;

            string text;
            getline(in, text); //  считает пустую строку, ибо number_lines занимало всю строку
            assert(text.empty());
            for (int i = 0; i < number_lines; ++i) {
                string line;
                getline(in, line);
                text += line + "\n";
            }

            parser.parse(title, text);
        }
        parser.summary();
    }
};

int main() {
    freopen("results/frequencies.txt", "w", stdout);
    TxtParser parser;
    parser.parse();
    return 0;
}