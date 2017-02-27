#ifndef WIKIPEDIA_EFICATION_COUNTER_NUMBER_RUSSIAN_WORDS_H
#define WIKIPEDIA_EFICATION_COUNTER_NUMBER_RUSSIAN_WORDS_H

#include <bits/stdc++.h>
#include "string_helper.h"
using namespace std;

struct CounterNumberRussianWords {
    static bool isRussianLetterInWord(char16_t c) {
        return isRussian(c) || isRussianDelimiter(c);
    }

    static bool isRussianWord(const u16string &text, size_t i, size_t length) {
        size_t j = i + length;
        return (i == 0 || !isRussianLetterInWord(text[i - 1])) && (j == text.length() || !isRussianLetterInWord(text[j]));
    }

    static size_t getNumberRussianWords(const u16string &text, u16string word, size_t start = 0, size_t end = string::npos) {
        size_t position = start;
        size_t numberMatches = 0;
        while ((position = text.find(word, position)) < end) {
            numberMatches += isRussianWord(text, position, word.length());
            position += word.length();
        }
        return numberMatches;
    }
};

#endif //WIKIPEDIA_EFICATION_COUNTER_NUMBER_RUSSIAN_WORDS_H
