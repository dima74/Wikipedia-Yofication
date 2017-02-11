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

const string BOT_NAME = "Дима74";
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

struct RemotePage {
    size_t revision;
    bool protect;
    string timestamp;
    string text;
};

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

    void changePage(Page page, RemotePage remotePage, string newText) {
        clearSession();
        session.SetOption(Payload{{"format",        "json"},
                                  {"action",        "edit"},
                                  {"title",         page.title},
                                  {"text",          newText},
                                  {"token",         editToken},
                                  {"summary",       "ёфикация"},
                                  {"basetimestamp", remotePage.timestamp}});
        json response = post();
        if (response["edit"]["result"] != "Success") {
            cout << response << endl;
        }
        assert(response["edit"]["result"] == "Success");
    }

    RemotePage getRemotePage(string title) {
        clearSession();
        session.SetOption(Payload{{"format", "json"},
                                  {"action", "query"},
                                  {"prop",   "info|revisions"},
                                  {"inprop", "protection"},
                                  {"rvprop", "timestamp|content"},
                                  {"titles", title}});

        json response = post();
        RemotePage page;
        json pageJson = response["query"]["pages"].front();
        page.revision = pageJson["lastrevid"];
        page.protect = !pageJson["protection"].empty();
        json revisionJson = pageJson["revisions"].front();
        page.timestamp = revisionJson["timestamp"];
        page.text = revisionJson["*"];
        return page;
    }
};

string getPageUrl(string title) {
    string url = "https://ru.wikipedia.org/wiki/" + title;
    replaceAll(url, " ", "_");
    return url;
}

#endif //PARSE_WIKIPEDIA_API_H