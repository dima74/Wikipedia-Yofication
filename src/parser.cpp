#include <bits/stdc++.h>
#include "u32string.h"
#include "string_helper.h"
#include "colors.h"
#include "page.h"
#include "txt_reader.h"
#include "word_info.h"
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

struct TitlesParser : public AbstractParser {
    void parse(Page page) {
        cout << page.title << endl;
    }
};

void createSentences() {
    SentencesParser parser;
    TxtReader().readTo(parser, 1000);
    parser.summary();
}

#include <cpr/cpr.h>
using namespace cpr;
#include "json.hpp"
using json = nlohmann::json;
#include <fmt/format.h>
#include <fmt/format.cc>
using namespace fmt;

Cookies cookies;

json get(Session &session) {
    session.SetOption(cookies);
    Response response = session.Get();
//    cout << endl;
//    cout << cookies.GetEncoded() << endl;
//    cout << response.cookies.GetEncoded() << endl;
    cookies = response.cookies;
    return json::parse(response.text);
}

json post(Session &session) {
    session.SetOption(cookies);
    Response response = session.Post();
//    cout << endl;
//    cout << cookies.GetEncoded() << endl;
//    cout << response.cookies.GetEncoded() << endl;
    cookies = response.cookies;
    return json::parse(response.text);
}

json get(string url) {
    Session session;
    session.SetOption(Url{url});
    return get(session);
}

json post(string url) {
    Session session;
    session.SetOption(Url{url});
    return get(session);
}

const string BOT_NAME = "Дима74 (Бот)";
const string BOT_PASSWORD = "zkexibq";

void checkForLogin() {
    json response = get("https://ru.wikipedia.org/w/api.php?format=json&action=query&meta=userinfo&uiprop=rights%7Chasmsg");
    cout << response << endl;
    return;

    string currentUserName = response["query"]["userinfo"]["name"];
    cout << currentUserName << endl;
    assert(currentUserName == BOT_NAME);
}

string getToken() {
    json response = get("https://ru.wikipedia.org/w/api.php?format=json&action=query&meta=tokens&type=login");
    return response["query"]["tokens"]["logintoken"];
}

void login(string token) {
//    json response = post(format("https://ru.wikipedia.org/w/api.php?format=json&action=login&lgname=%s&lgpassword=%s&lgtoken=%s", BOT_NAME, BOT_PASSWORD, token));
//    cout << response << endl;

    Session session;
    session.SetOption(Url{"https://ru.wikipedia.org/w/api.php?format=json&action=login"});
    session.SetOption(Payload{{"lgname",     BOT_NAME},
                              {"lgpassword", BOT_PASSWORD},
                              {"lgtoken",    token}});
    cout << post(session) << endl;
}

int main() {
//    createSentences();
//    string token = getToken();
//    login(token);
//    checkForLogin();
    return 0;

    {
        Session session;
        session.SetOption(Url{"https://ru.wikipedia.org/w/api.php?format=json&action=query&meta=tokens&type=login"});
        string token = json::parse(session.Get().text)["query"]["tokens"]["logintoken"];

        session.SetOption(Url{"https://ru.wikipedia.org/w/api.php?format=json&action=login"});
        session.SetOption(Payload{{"lgname",     BOT_NAME},
                                  {"lgpassword", BOT_PASSWORD},
                                  {"lgtoken",    token}});
        cout << json::parse(session.Post().text) << endl;

        session.SetOption(Payload{});
        session.SetOption(Url{"https://ru.wikipedia.org/w/api.php?format=json&action=query&meta=userinfo&uiprop=rights%7Chasmsg"});
        cout << json::parse(session.Get().text) << endl;
    }
    return 0;
}