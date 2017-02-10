#include <bits/stdc++.h>
#include "u32string.h"
#include "string_helper.h"
#include "colors.h"
#include "page.h"
#include "txt_reader.h"
#include "word_info.h"
#include "wikipedia_api.h"
#include "clipboard.h"
using namespace std;

void nop() {}

const size_t MAX_WIDTH = 180;

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

size_t findFirst(u32string source, vector<u32string> whats, size_t startPosition) {
    size_t position = string::npos;
    for (u32string what : whats) {
        position = min(position, source.find(what, startPosition));
    }
    return position;
}

pair<u32string, u32string> getWordContext(u32string text, u32string word, size_t i) {
    size_t length = word.length();
    size_t length0 = (MAX_WIDTH - length) / 2;
    size_t length1 = MAX_WIDTH - length0 - length;
    u32string sentence0 = text.substr(i > length0 ? i - length0 : 0, length0);
    u32string sentence1 = text.substr(i + length, length1);

    sentence0 = sentence0.substr(sentence0.rfind(U'\n') + 1);
    sentence1 = sentence1.substr(0, sentence1.find(U'\n'));

    sentence0 = u32string(length0 - sentence0.length(), U' ') + sentence0;
    sentence1 += u32string(length1 - sentence1.length(), U' ');
    return {sentence0, sentence1};
};

struct SentencesParser : public AbstractParser {
//    dword -> eword
    map<u32string, u32string> right;

    SentencesParser() {
        ifstream in("results/frequencies.txt");
        assert(in);

        EwordInfo info;
        while (in >> info && info.getFrequency() > .5) {
            if (isRussianLower(info.eword[0])) {
                right[deefication(info.eword)] = info.eword;
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

        u32string text = to32(page.text);
        for (ReplaceInfo info : infos) {
            cout << info.sentence0 << cyan << info.getWord(text) << def << info.sentence1 << endl;
            cout << info.sentence0 << cyan << info.eword << def << info.sentence1 << endl;
            cout << endl;
        }
    }

    vector<ReplaceInfo> getReplaces(Page page) {
        vector<ReplaceInfo> infos;
        u32string text = to32(page.text);

        size_t textEnd = text.length();
        textEnd = min(textEnd, text.find(U"== Литература =="));
        textEnd = min(textEnd, text.find(U"== Ссылки =="));
        textEnd = min(textEnd, text.find(U"== Примечания =="));

        vector<pair<vector<u32string>, vector<u32string>>> excludes = {
                {{U"<nowiki",         U"<Nowiki", U"<NOWIKI"}, {U"/nowiki>",       U"/Nowiki>", U"/NOWIKI>"}},
                {{U"<ref",            U"<Ref",    U"<REF"},    {U"/ref>",          U"/Ref>",    U"/REF>", U"/>"}},
                {{U"{{начало цитаты", U"{{Начало цитаты"},     {U"{{конец цитаты", U"{{Конец цитаты"}},
                {{U"<!--"},                                    {U"-->"}},
                {{U"{{цитата",        U"{{Цитата"},            {U"}}"}},
                {{U"<blockquote>"},                            {U"</blockquote>"}},
                {{U"«"},                                       {U"»"}}
        };
        map<size_t, size_t> mapExcludes;
        for (auto exclude : excludes) {
            size_t start_position = 0;
            while ((start_position = findFirst(text, exclude.first, start_position)) != string::npos) {
                size_t end_position = findFirst(text, exclude.second, start_position);
                mapExcludes[start_position] = end_position;
                assert(end_position != string::npos);
                start_position = end_position;
            }
        }

        for (size_t i = 0; i < textEnd; ++i) {
            auto itExclude = mapExcludes.find(i);
            if (itExclude != mapExcludes.end()) {
                i = itExclude->second;
                continue;
            }

            if (isRussian(text[i])) {
                for (size_t j = i; j <= text.length(); ++j) {
                    if (j == text.length() || !isRussian(text[j])) {
                        u32string word = text.substr(i, j - i);
                        auto it = right.find(word);
                        if (it != right.end()) {

                            if (j < text.length() && text[j] == U'.' && word.length() <= 5) {
                                // возможно это сокращение
                                if (!(j + 2 < text.length() && text[j + 1] == ' ' && isRussianUpper(text[j + 2]))) {
                                    i = j - 1;
                                    break;
                                }
                            }

                            u32string eword = it->second;
                            assert(eword.length() < MAX_WIDTH);
                            auto context = getWordContext(text, eword, i);
                            infos.emplace_back(i, eword, context.first, context.second);
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

        string titleToPrint = "==  " + page.title + "  ==";
        cout << u32string((MAX_WIDTH - to32(titleToPrint).length()) / 2, U' ') << titleToPrint << endl;

        string url = "https://ru.wikipedia.org/wiki/" + page.title;
        replaceAll(url, " ", "_");
        cout << url << endl;

        string u8text = page.text;
        u32string text = to32(u8text);
        u32string textReplaced = text;
        bool replaceSomething = false;
        for (ReplaceInfo info : infos) {
            cout << info.sentence0 << cyan << info.getWord(text) << def << info.sentence1 << endl;
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

void createSentences() {
    SentencesParser parser;
    TxtReader().readTo(parser, 1000);
}

void interactive() {
    Interactive interactive;
    TxtReader().readTo(interactive, 1000);
}

void showFrequenciesInfo() {
    ifstream in("results/frequencies.txt");
    assert(in);

    EwordInfo info;
    int n = 10;
    size_t numbers[n] = {0};
    vector<u32string> words[n];
    while (in >> info) {
        if (isRussianLower(info.eword[0])) {
            size_t frequency = info.number * n / info.numberAll;
            if (rand() % 100 == 0) {
                words[frequency].push_back(info.eword);
            }
            ++numbers[frequency];
        }
    }

    for (int i = 0; i < n; ++i) {
        printf("%2d %7zu\n", i, numbers[i]);
    }

    cout << endl;
    for (int i = 0; i < n; ++i) {
        cout << i << endl;
        for (u32string s : words[i]) {
            cout << "\t" << s << endl;
        }
    }
}

void printPagesThatContains(string word8) {
    u32string word = to32(word8);
    TxtReader().readToLambda([&word](Page page) {
        u32string text = to32(page.text);
        size_t i = text.find(word);
        if (i != string::npos) {
            auto context = getWordContext(text, word, i);
            cout << page.title << endl;
            cout << context.first << cyan << word << def << context.second << endl;
            return;
        }
    });
}

int main() {
    interactive();
    return 0;
}