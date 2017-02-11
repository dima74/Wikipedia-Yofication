#ifndef PARSE_ALIGNMENT_H
#define PARSE_ALIGNMENT_H

#include <bits/stdc++.h>
using namespace std;

const size_t MAX_LENGTH = 180;
const size_t NUMBER_LINES = 1;

template<typename Iterator>
pair<u32string, Iterator> getDirectionalContext(Iterator begin, Iterator end, size_t maxLength) {
    u32string context = u32string(begin, begin + min(maxLength, (size_t) (end - begin)));

//    context = context.substr(0, context.find(U'\n'));
    replace(context.begin(), context.end(), U'\n', U' ');

    assert(context.length() <= end - begin);
    Iterator newBegin = begin + context.length();
//    while (newBegin != end && *newBegin == U'\n') {
//        ++newBegin;
//    }

    context += u32string(maxLength - context.length(), U' ');
    assert(context.length() == maxLength);
    return {context, newBegin};
}

pair<u32string, u32string> getWordContext(u32string text, u32string word, size_t i) {
    size_t length = word.length();
    size_t length0 = (MAX_LENGTH - length) / 2;
    size_t length1 = MAX_LENGTH - length0 - length;

    pair<u32string, u32string> context;
    auto context0 = make_pair(u32string(), text.rend() - i);
    auto context1 = make_pair(u32string(), text.begin() + i + length);
    for (size_t line_index = 0; line_index <= NUMBER_LINES; ++line_index) {
        context0 = getDirectionalContext(context0.second, text.rend(), line_index == 0 ? length0 : MAX_LENGTH);
        context1 = getDirectionalContext(context1.second, text.end(), line_index == 0 ? length1 : MAX_LENGTH);
        context.first += context0.first + U"\n";
        context.second += context1.first + U"\n";
    }
    context.first.pop_back();
    context.second.pop_back();
    reverse(context.first.begin(), context.first.end());
    return {context.first, context.second};
};

string getTitleAligned(string title) {
    string titleToPrint = "==  " + title + "  ==";
    return string((MAX_LENGTH - to32(titleToPrint).length()) / 2, ' ') + titleToPrint;
}

#endif //PARSE_ALIGNMENT_H
