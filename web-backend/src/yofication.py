import ctypes
import re

from termcolor import cprint


def deyoficate(string):
    return string.replace('ё', 'е').replace('Ё', 'Е')


class EWord(str):
    def __new__(cls, eword, number_with_e, number_all):
        return str.__new__(cls, eword)

    def __init__(self, eword, number_with_yo, number_all):
        super().__init__()
        self.number_with_yo = int(number_with_yo)
        self.number_all = int(number_all)

    def frequency(self):
        return self.number_with_yo * 100 // self.number_all


def readlines(filename):
    return open('/home/dima/Wikipedia-Yofication/cpp-frequencies/results/' + filename).readlines()


lines = readlines('all-ewords.txt') + readlines('frequencies.txt')
words = {deyoficate(eword): EWord(eword, number_with_yo, number_all) for (eword, number_with_yo, number_all) in map(str.split, lines)}
words = {dword: eword for dword, eword in words.items() if eword.number_with_yo > 100}


def yoficate_text(text, min_frequency=60, yoficate_words_starts_with_upper=True):
    matches = re.finditer('([а-яА-ЯёЁ]+(-[а-яА-ЯёЁ]+)*)', text)
    text_mutable = ctypes.create_unicode_buffer(text)
    number_replaces = 0
    for match in matches:
        start = match.start()
        end = match.end()
        if start > 0 and text[start - 1] == ']':
            # слова вида [[воздух]]е
            continue

        dword = match.group()
        if dword in words:
            eword = words[dword]
            if eword.frequency() >= min_frequency and (yoficate_words_starts_with_upper or eword[0].islower()):
                text_mutable[start:end] = eword
                number_replaces += 1
    return text_mutable.value, number_replaces
