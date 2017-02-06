#ifndef PARSE_WIKIPEDIA_API_H
#define PARSE_WIKIPEDIA_API_H

#include <bits/stdc++.h>
using namespace std;

#include <cpr/cpr.h>
using namespace cpr;
#include "json.hpp"
using json = nlohmann::json;
#include <fmt/format.h>
#include <fmt/format.cc>
using namespace fmt;

const string BOT_NAME = "Дима74 (Бот)";
const string BOT_PAGE = "Участник:Дима74 (Бот)";
const string BOT_PASSWORD = "zkexibq";

string stringDiff(string a, string b) {
    if (a == b) {
        return "Строки равны";
    }
    size_t n = min(a.length(), b.length());
    for (size_t i = 0; i < n; ++i) {
        if (a[i] != b[i]) {
            return format("Различаются в позиции {}\na: '{}'\nb: '{}'", i, a.substr(i), b.substr(i));
        }
    }

    pair<string, string> ss[2] = {{"a", a},
                                  {"b", b}};
    if (a.length() > b.length()) {
        swap(ss[0], ss[1]);
    }
    return format("Разные длины: {} vs {}. {} --- префикс {}, оставшаяся часть в {}: '{}'", a.length(), b.length(), ss[0].first, ss[1].first, ss[0].first, ss[1].second.substr(ss[0].second.length()));
}

struct WikipediaApi {
    Session session;
    string token;
    string editToken;

    WikipediaApi() {
        getLoginToken();
        login();
        checkForLogin();
        getEditToken();
        assert(!token.empty());
        assert(!editToken.empty());
    }

    void clearSession() {
        session.SetOption(Parameters{});
        session.SetOption(Payload{});
        session.SetOption(Url{"https://ru.wikipedia.org/w/api.php"});
    }

    json get() {
        Response response = session.Get();
        assert(response.status_code == 200);
        return json::parse(response.text);
    }

    json post() {
        Response response = session.Post();
        assert(response.status_code == 200);
        return json::parse(response.text);
    }

    json get(string url) {
        clearSession();
        session.SetOption(Url{url});
        return get();
    }

    json post(string url) {
        clearSession();
        session.SetOption(Url{url});
        return post();
    }

    void getLoginToken() {
        json response = get("https://ru.wikipedia.org/w/api.php?format=json&action=query&meta=tokens&type=login");
        token = response["query"]["tokens"]["logintoken"];
    }

    void login() {
        clearSession();
        session.SetOption(Url{"https://ru.wikipedia.org/w/api.php?format=json&action=login"});
        session.SetOption(Payload{{"lgname",     BOT_NAME},
                                  {"lgpassword", BOT_PASSWORD},
                                  {"lgtoken",    token}});
        post();
    }

    void checkForLogin() {
        json response = get("https://ru.wikipedia.org/w/api.php?format=json&action=query&meta=userinfo&uiprop=rights%7Chasmsg");
        string currentUserName = response["query"]["userinfo"]["name"];
        assert(currentUserName == BOT_NAME);
    }

    void getEditToken() {
        clearSession();
        session.SetOption(Url{"https://ru.wikipedia.org/w/api.php?format=json&action=query&meta=tokens"});
        editToken = get()["query"]["tokens"]["csrftoken"];
    }

    size_t createPage(string title, string text) {
        clearSession();
        session.SetOption(Payload{{"format",     "json"},
                                  {"action",     "edit"},
                                  {"title",      title},
                                  {"text",       text},
                                  {"createonly", "true"},
                                  {"token",      editToken}});
        json response = post();
        if (response["edit"]["result"] != "Success") {
            cout << response << endl;
        }
        assert(response["edit"]["result"] == "Success");
        return response["edit"]["newrevid"];
    }

    string getTimestamp(string title, size_t revision) {
        clearSession();
        session.SetOption(Payload{{"format", "json"},
                                  {"action", "query"},
                                  {"prop",   "info|revisions"},
                                  {"rvprop", "timestamp"},
                                  {"titles", title}});
        json response = post();
        json page = response["query"]["pages"].front();
        if (page["lastrevid"] != revision) {
            throw std::runtime_error(format("revisions doesn't match: your {}, last {}", revision, page["lastrevid"]));
        }
        return page["revisions"][0]["timestamp"];
    }

    void changePage(string title, string originalText, string text, size_t revision) {
        string timestamp = getTimestamp(title, revision);
        string currentText = getPageContent(title);
        originalText.pop_back();
        text.pop_back();
        string diff = stringDiff(currentText, originalText);
        assert(currentText == originalText);

        string diff2 = stringDiff(text, originalText);
        assert(text != originalText);

        clearSession();
        session.SetOption(Payload{{"format",        "json"},
                                  {"action",        "edit"},
                                  {"title",         title},
                                  {"text",          text},
                                  {"token",         editToken},
                                  {"basetimestamp", timestamp}});
        json response = post();
        if (response["edit"]["result"] != "Success") {
            cout << response << endl;
        }
//        assert(response["edit"]["result"] == "Success");
    }

    size_t getPageRevision(string title) {
        clearSession();
        session.SetOption(Payload{{"format", "json"},
                                  {"action", "query"},
                                  {"prop",   "info"},
                                  {"titles", title}});
        json response = post();
        return response["query"]["pages"].front()["lastrevid"];
    }

    string getPageContent(string title) {
        clearSession();
        session.SetOption(Payload{{"format", "json"},
                                  {"action", "query"},
                                  {"prop",   "revisions"},
                                  {"rvprop", "content"},
                                  {"titles", title}});
        json response = post();
        return response["query"]["pages"].front()["revisions"].front()["*"];
    }
};

#endif //PARSE_WIKIPEDIA_API_H