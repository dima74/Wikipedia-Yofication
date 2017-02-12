#ifndef PARSE_WIKIPEDIA_API_H
#define PARSE_WIKIPEDIA_API_H

#include <bits/stdc++.h>
#include "string_helper.h"
using namespace std;

#include <cpr/cpr.h>
using namespace cpr;
#include "../lib/json.hpp"
using json = nlohmann::json;
#include <fmt/format.h>
#include <fmt/format.cc>
using namespace fmt;

const string BOT_NAME = "Дима74";
const string BOT_PASSWORD = "eficator@c90qfhhvvv4mctnl63fe9u2s7sbja9cb";
const string BOT_PAGE = "Участник:Дима74 (Бот)";

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
    Cookies cookies;
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

    void updateCookies(Cookies &cookies, Cookies additionalCookies) {
        for (auto cookie : additionalCookies.map_) {
            cookies.map_[cookie.first] = cookie.second;
        }
    }

    template<typename... Ts>
    json get(Ts &&... ts) {
        Response response = Get(Url{"https://ru.wikipedia.org/w/api.php"}, cookies, CPR_FWD(ts)...);
        assert(response.status_code == 200);
        updateCookies(cookies, response.cookies);
        return json::parse(response.text);
    }

    template<typename... Ts>
    json post(Ts &&... ts) {
        Response response = Post(Url{"https://ru.wikipedia.org/w/api.php"}, cookies, CPR_FWD(ts)...);
        assert(response.status_code == 200);
        updateCookies(cookies, response.cookies);
        return json::parse(response.text);
    }

    void getLoginToken() {
        json response = get(Url{"https://ru.wikipedia.org/w/api.php?format=json&action=query&meta=tokens&type=login"});
        token = response["query"]["tokens"]["logintoken"];
    }

    void login() {
        json response = post(Payload{{"format",     "json"},
                                     {"action",     "login"},
                                     {"lgname",     BOT_NAME},
                                     {"lgpassword", BOT_PASSWORD},
                                     {"lgtoken",    token}});
        assert(response["login"]["result"] == "Success");
    }

    void checkForLogin() {
        json response = get(Url{"https://ru.wikipedia.org/w/api.php?format=json&action=query&meta=userinfo"});
        string currentUserName = response["query"]["userinfo"]["name"];
        assert(currentUserName == BOT_NAME);
    }

    void getEditToken() {
        json response = get(Url{"https://ru.wikipedia.org/w/api.php?format=json&action=query&meta=tokens"});
        editToken = response["query"]["tokens"]["csrftoken"];
    }

    size_t createPage(string title, string text) {
        json response = post(Payload{{"format",     "json"},
                                     {"action",     "edit"},
                                     {"title",      title},
                                     {"text",       text},
                                     {"createonly", "true"},
                                     {"token",      editToken}});
        if (response["edit"]["result"] != "Success") {
            cout << response << endl;
        }
        assert(response["edit"]["result"] == "Success");
        return response["edit"]["newrevid"];
    }

    void changePage(Page page, RemotePage remotePage, string newText) {
        json response = post(Payload{{"format",        "json"},
                                     {"action",        "edit"},
                                     {"title",         page.title},
                                     {"text",          newText},
                                     {"token",         editToken},
                                     {"summary",       "ёфикация"},
                                     {"basetimestamp", remotePage.timestamp}});
        if (response["edit"]["result"] != "Success") {
            cout << response << endl;
        }
        assert(response["edit"]["result"] == "Success");
    }

    RemotePage getRemotePage(string title) {
        json response = post(Payload{{"format", "json"},
                                     {"action", "query"},
                                     {"prop",   "info|revisions"},
                                     {"inprop", "protection"},
                                     {"rvprop", "timestamp|content"},
                                     {"titles", title}});
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