#ifndef PARSE_ALIGNMENT_H
#define PARSE_ALIGNMENT_H

#include <bits/stdc++.h>
using namespace std;

const size_t MAX_LENGTH = 180;
const size_t NUMBER_LINES = 1;

template<typename Iterator>
pair<u16string, Iterator> getDirectionalContext(Iterator begin, Iterator end, size_t maxLength) {
    u16string context = u16string(begin, begin + min(maxLength, (size_t) (end - begin)));

//    context = context.substr(0, context.find(u'\n'));
    replace(context.begin(), context.end(), u'\n', u' ');

    assert(context.length() <= end - begin);
    Iterator newBegin = begin + context.length();
//    while (newBegin != end && *newBegin == u'\n') {
//        ++newBegin;
//    }

    context += u16string(maxLength - context.length(), u' ');
    assert(context.length() == maxLength);
    return {context, newBegin};
}

pair<u16string, u16string> getWordContext(u16string text, u16string word, size_t i) {
    size_t length = word.length();
    size_t length0 = (MAX_LENGTH - length) / 2;
    size_t length1 = MAX_LENGTH - length0 - length;

    pair<u16string, u16string> context;
    auto context0 = make_pair(u16string(), text.rend() - i);
    auto context1 = make_pair(u16string(), text.begin() + i + length);
    for (size_t line_index = 0; line_index <= NUMBER_LINES; ++line_index) {
        context0 = getDirectionalContext(context0.second, text.rend(), line_index == 0 ? length0 : MAX_LENGTH);
        context1 = getDirectionalContext(context1.second, text.end(), line_index == 0 ? length1 : MAX_LENGTH);
        context.first += context0.first + u"\n";
        context.second += context1.first + u"\n";
    }
    context.first.pop_back();
    context.second.pop_back();
    reverse(context.first.begin(), context.first.end());
    return {context.first, context.second};
};

string getTitleAligned(string title) {
    string titleToPrint = "==  " + title + "  ==";
    return string((MAX_LENGTH - to16(titleToPrint).length()) / 2, ' ') + titleToPrint;
}

#endif //PARSE_ALIGNMENT_H
