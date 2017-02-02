#include <bits/stdc++.h>
#include "u32string.h"
#include "string_helper.h"
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
    return out << info.eword << " " << info.number << "/" << info.numberAll;
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
        for (int i = 0; i < bests.size(); ++i) {
            cout << bests[i] << endl;
        }
    }
};

struct XmlParser {
    const string page = "  <page>";
    const string title_start = "    <title>";
    const string title_end = "</title>";
    const string text_start = "      <text xml:space=\"preserve\">";
    const string text_end = "</text>";

    ifstream in = ifstream("../ruwiki-20161201-pages-articles.xml");
    WikipediaParser parser;

    string get_title() {
        string line;
        while (getline(in, line)) {
            if (line == page) {
                string title;
                getline(in, title);
                assert(starts_with(title, title_start));
                return title.substr(title_start.length(), title.length() - title_start.length() - title_end.length());
            }
        }
        assert(0);
        throw;
    }

    string get_text() {
        string line;
        while (getline(in, line)) {
            if (starts_with(line, text_start)) {
                string text = line.substr(text_start.length());
                if (ends_with(text, text_end)) {
                    return text.substr(0, text.length() - text_end.length());
                }
                while (getline(in, line)) {
                    if (ends_with(line, text_end)) {
                        text += "\n" + line.substr(0, line.length() - text_end.length());

                        while (text.front() == '\n') {
                            text = text.substr(1);
                        }
                        while (text.back() == '\n') {
                            text.pop_back();
                        }

                        return text;
                    } else {
                        text += "\n" + line;
                    }
                }
                assert(0);
            }
        }
        assert(0);
        throw;
    }

    void parse() {
//        int number_pages = 3849882;
        int number_pages = 100;
        for (int ipage = 0; ipage < number_pages; ++ipage) {
            string title = get_title();
            string text = get_text();
            parser.parse(title, text);
        }
        parser.summary();
    }
};

int main() {
    XmlParser parser;
    parser.parse();
    printf("%.3f seconds\n", clock() / float(CLOCKS_PER_SEC));
    return 0;
}

