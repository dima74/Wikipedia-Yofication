import ctypes
import re

from termcolor import cprint


def deyoficate(string):
    return string.replace('ё', 'е').replace('Ё', 'Е')


class YoWord(str):
    def __new__(cls, yoword, number_with_yo, number_all):
        return str.__new__(cls, yoword)

    def __init__(self, yoword, number_with_yo, number_all):
        super().__init__()
        self.number_with_yo = int(number_with_yo)
        self.number_all = int(number_all)

    def frequency(self):
        return self.number_with_yo * 100 // self.number_all


def readlines(filename):
    with open('/home/dima/Wikipedia-Yofication/cpp-frequencies/results/' + filename) as input:
        return input.readlines()


lines = readlines('all-yowords.txt') + readlines('frequencies.txt')
words = {deyoficate(yoword): YoWord(yoword, number_with_yo, number_all) for (yoword, number_with_yo, number_all) in map(str.split, lines)}
words = {dword: yoword for dword, yoword in words.items() if yoword.number_with_yo > 100}


def yoficate_text_complex(text, **kwargs):
    min_frequency = kwargs.get('min_frequency', 60)
    yoficate_words_starts_with_upper = kwargs.get('yoficate_words_starts_with_upper', True)

    matches = re.finditer('([а-яА-ЯёЁ]+(-[а-яА-ЯёЁ]+)*)', text)
    text_mutable = ctypes.create_unicode_buffer(text)
    replaces = []
    for match in matches:
        start = match.start()
        end = match.end()
        if start > 0 and text[start - 1] == ']':
            # слова вида [[воздух]]е
            continue

        dword = match.group()
        if dword in words:
            yoword = words[dword]
            if yoword.frequency() >= min_frequency and (yoficate_words_starts_with_upper or yoword[0].islower()):
                text_mutable[start:end] = yoword
                replace = {
                    'yoword': yoword,
                    'wordStartIndex': start,
                    'frequency': yoword.frequency()
                }
                replaces.append(replace)

    result = {
        'yotext': text_mutable.value,
        'replaces': replaces,
        'is_text_changed': len(replaces) > 0
    }
    return result


def yoficate_text(text, **kwargs):
    result = yoficate_text_complex(text)
    return result['yotext'], len(result['replaces'])
