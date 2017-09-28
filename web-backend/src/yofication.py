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


# words = {dword: yoword for dword, yoword in words.items() if yoword.number_with_yo > 100}


def get_sections_start_index(text):
    sections = ['литература', 'ссылки', 'примечания', 'сочинения', 'источники', 'труды']
    result = len(text)
    for section in sections:
        match = re.search('==\s*{}\s*=='.format(section), text, re.IGNORECASE)
        if match:
            result = min(result, match.start())
    return result


def check_match(text, match, dword):
    start = match.start()
    end = match.end()
    prev_char = text[start - 1] if start > 0 else ''
    next_char = text[end] if end < len(text) else ''

    def is_russian_letter_in_word(char):
        # обычный дефис
        # мягкий перенос
        # ударение
        return re.match('[а-яА-ЯёЁ\-\u00AD\u0301]', char)

    if is_russian_letter_in_word(prev_char) or is_russian_letter_in_word(next_char):
        return False

    if prev_char == ']':
        # слова вида [[воздух]]е
        return False

    if next_char == '.' and len(dword) <= 5:
        # сокращения: нем.
        return False

    if is_dword_inside_tags(dword, text, start):
        return False

    return True


def is_dword_inside_tags(dword, text, wordStartIndex):
    tags = [
        ('<', '>'),
        ('[[', ']]'),
        ('[', ']'),
        ('{{', '}}'),
        # ('{{начало цитаты', '{{конец цитаты'),
        # ('«', '»'),
        ('<!--', '-->'),
        # ('<source', '</source'),
        # ('<ref', '</ref'),
        # ('<blockquote', '</blockquote')
    ]

    for tag in tags:
        start = text.rfind(tag[0], 0, wordStartIndex)
        if start == -1:
            continue

        end = text.find(tag[1], start)
        if end == -1:
            # raise Exception('Непарный тег {} в позиции {}'.format(tag[0], start))
            continue

        # либо сначала искать закрывающий тег, а потом открывающий, либо вообще убрать проверку на нахождение внутри тега, и чекать это на клиенте (либо пусть пользователь чекает, либо по классам родителей, наверняка цитаты и всё такое имеют собственные классы (да, кажется обычно цитаты лежат внутри тега <blockquote>, можно игнорить его!))
        if wordStartIndex < end:
            return True

    return False


def yoficate_text_complex(text, **kwargs):
    min_replace_frequency = kwargs.get('min_replace_frequency', 60)
    yoficate_words_starts_with_upper = kwargs.get('yoficate_words_starts_with_upper', True)

    matches = re.finditer('([а-яА-ЯёЁ]+(-[а-яА-ЯёЁ]+)*)', text)
    text_mutable = ctypes.create_unicode_buffer(text)
    replaces = []
    sections_start_index = get_sections_start_index(text)
    for match in matches:
        start = match.start()
        end = match.end()
        dword = match.group()
        if dword in words:
            if start >= sections_start_index:
                break

            if not check_match(text, match, dword):
                continue

            yoword = words[dword]
            if yoword.frequency() >= min_replace_frequency and (yoficate_words_starts_with_upper or yoword[0].islower()):
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
