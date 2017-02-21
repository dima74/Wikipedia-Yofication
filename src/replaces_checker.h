#ifndef PARSE_REPLACE_CHECKER_H
#define PARSE_REPLACE_CHECKER_H

#include <bits/stdc++.h>
#include "string_helper.h"
using namespace std;

// Формат:
// == Section ==
size_t findSection(const u16string &text, u16string section) {
    vector<u16string> tokens = {u"==", section, u"=="};
    for (size_t lineStart = 0, lineEnd = text.find(u'\n'); lineStart != string::npos; lineStart = lineEnd == string::npos ? string::npos : lineEnd + 1, lineEnd = text.find(u'\n', lineEnd + 1)) {
        bool find = true;
        size_t i = lineStart;
        for (const u16string &token : tokens) {
            i = text.find_first_not_of(u" \t", i);
            if (i == string::npos || text.compare(i, token.length(), token) != 0) {
                find = false;
                break;
            }
            i += token.length();
        }
        if (find) {
            return lineStart;
        }
    }
    return text.length();
}

size_t getSectionsStart(const u16string &text, const u16string &textLower) {
    size_t sectionsStart = text.length();
    const vector<u16string> excludeSections = {u"литература", u"ссылки", u"примечания", u"сочинения", u"источники"};
    for (u16string excludeSection : excludeSections) {
        sectionsStart = min(sectionsStart, findSection(textLower, excludeSection));
    }
    return sectionsStart;
}

struct ReplaceChecker {
    const u16string &text;
    const u16string &textLower;

    ReplaceChecker(const u16string &text, const u16string &textLower) : text(text), textLower(textLower) {}

    bool check(size_t indexWordStart) {
        try {
            return checkInsideTags(indexWordStart) && checkBetweenTags(indexWordStart);
        } catch (...) {
            return false;
        }
    }

    bool checkInsideTags(size_t indexWordStart) {
        struct Tag {
            u16string open;
            u16string close;
        };

        vector<Tag> tags = {
                {u"<",               u">"},
                {u"[[",              u"]]"},
                {u"[",               u"]"},
                {u"{{",              u"}}"},
                {u"{{начало цитаты", u"{{конец цитаты"},
                {u"«",               u"»"},
                {u"<!--",            u"-->"},
                {u"<source",         u"</source"}
        };
        for (Tag tag : tags) {
            size_t start = textLower.rfind(tag.open, indexWordStart);
            if (start == string::npos) {
                continue;
            }
            size_t end = textLower.find(tag.close, start);
            if (end == string::npos && tag.open == u"<") {
                continue;
            }

//            assert(end != string::npos);
            if (end == string::npos) {
//                throw runtime_error(format("Непарный тег '{}' в позиции {}", tag.open, start));
                return false;
            }

            if (indexWordStart <= end) {
                return false;
            }
        }
        return true;
    }

    pair<size_t, size_t> findLeftTag(size_t indexWordStart) {
        static const pair<size_t, size_t> NO_TAG = {string::npos, string::npos};
        size_t start0 = textLower.rfind(u'<', indexWordStart);
        if (start0 == string::npos) {
            // слева вообще нет тегов
            return NO_TAG;
        }
        if (start0 + 1 < textLower.length() && textLower[start0 + 1] == u'/') {
            // ближайший слева тег --- закрывающийся
            return NO_TAG;
        }

        // Несколько исключений
        vector<u16string> notTags = {u"<br", // часто вместо <br /> пишут <br>
                                     u"<!--", // комментарий
                                     u"<--", // иногда так пишут комментария (это неправильно, конечно)
                                     u"<…>",
                                     u"< "}; // знак "меньше" в обычном тексте (должно быть, конечно, "&lt;")
        for (u16string notTag : notTags) {
            if (textLower.compare(start0, notTag.length(), notTag) == 0) {
                return start0 == 0 ? NO_TAG : findLeftTag(start0 - 1);
            }
        }

        // находим закрывающую скобку левого тега
        size_t end0 = textLower.find(u'>', start0);
//        assert(end0 != string::npos);
        if (end0 == string::npos) { throw 1; }
        if (end0 == textLower.find(u"/>", start0) + 1) {
            // ближайший слева тег --- самозакрывающийся
            return start0 == 0 ? NO_TAG : findLeftTag(start0 - 1);
        }
        assert(start0 < end0);
        assert(start0 < text.length());
        assert(end0 < text.length());
        return {start0, end0};
    };

    bool checkBetweenTags(size_t indexWordStart) {
        // находим ближайший тег слева
        auto leftTag = findLeftTag(indexWordStart);
        size_t start0 = leftTag.first;
        size_t end0 = leftTag.second;
        if (start0 == string::npos) {
            return true;
        }

        assert(start0 < end0);
        assert(start0 < text.length());
        assert(end0 < text.length());

        // находим имя левого тега
        size_t nameStart0 = start0 + 1;
        size_t nameEnd0 = nameStart0;
        while ('a' <= textLower[nameEnd0] && textLower[nameEnd0] <= 'z') {
            ++nameEnd0;
        }
        u16string openName = textLower.substr(nameStart0, nameEnd0 - nameStart0);
//        assert(!openName.empty());
        if (openName.empty()) { throw 1; }

        // ищем закрывающий тег после открывающего
        u16string closeName = u"</" + openName;
        size_t start1 = textLower.find(closeName, end0);
//        assert(start1 != string::npos);
        if (start1 == string::npos) { throw 1; }
        return start1 < indexWordStart;
    }
};

#endif //PARSE_REPLACE_CHECKER_H
