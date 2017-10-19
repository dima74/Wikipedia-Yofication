import ctypes
import re


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
words = {dword: yoword for dword, yoword in words.items() if yoword.number_with_yo > 5}


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

    if prev_char.isalpha() or next_char.isalpha():
        return False

    if prev_char == ']':
        # слова вида [[воздух]]е
        return False

    if next_char == '.' and len(dword) <= 5:
        # сокращения: нем.
        next_word_length = 3
        next_word = text[end + 2:end + 2 + next_word_length]
        is_this_word_last_in_sentence = len(next_word) == next_word_length and next_word[0].isupper() and next_word.isalpha()
        if not is_this_word_last_in_sentence:
            return False

    if is_dword_inside_tags(dword, text, start):
        return False

    return True


def is_dword_inside_tags(dword, text, wordStartIndex):
    tags = [
        # ('<', '>'),
        # ('[[', ']]'),
        # ('[', ']'),
        # ('{{', '}}'),
        # ('{{начало цитаты', '{{конец цитаты'),
        ('«', '»'),
        ('<!--', '-->'),
        # ('<source', '</source'),
        # ('<ref', '</ref'),
        # ('<blockquote', '</blockquote'),
        # ('{{начало скрытого блока', '{{конец скрытого блока'),
        # ('Файл:', '.jpg'),
        # ('Файл:', '.png')
    ]

    for tag in tags:
        start = text.rfind(tag[0], 0, wordStartIndex)
        if start == -1:
            continue

            # file_prefix = 'Файл'
            # if text[start + 1:start + 1 + len(file_prefix)] == file_prefix:
            # обычно картинки вставляются вот так: [[Файл:Image.jpg|мини|Описание]]
            # Имя файла будем игнорить
            # А описание нет
            # continue

        end = text.find(tag[1], start)
        if end == -1:
            # raise Exception('Непарный тег {} в позиции {}'.format(tag[0], start))
            continue

        # либо сначала искать закрывающий тег, а потом открывающий, либо вообще убрать проверку на нахождение внутри тега, и чекать это на клиенте (либо пусть пользователь чекает, либо по классам родителей, наверняка цитаты и всё такое имеют собственные классы (да, кажется обычно цитаты лежат внутри тега <blockquote>, можно игнорить его!))
        if wordStartIndex < end:
            for_debug = text[start:end + 1]
            return True

    return False


def get_replaces(text, **kwargs):
    minimum_replace_frequency = kwargs.get('minimum_replace_frequency', 60)
    yoficate_words_starts_with_upper = kwargs.get('yoficate_words_starts_with_upper', True)

    matches = re.finditer('([а-яА-ЯёЁ]+(-[а-яА-ЯёЁ]+)*)', text)
    replaces = []
    for match in matches:
        start = match.start()
        end = match.end()
        dword = match.group()
        if dword in words:
            yoword = words[dword]
            if yoword.frequency() < minimum_replace_frequency:
                continue

            if not check_match(text, match, dword):
                # print('skip word {}, context: `{}`'.format(dword, text[start - 20:end + 40].replace('\n', r'\n')))
                # for debug
                # check_match(text, match, dword)
                continue

            if yoword[0].isupper():
                if not yoficate_words_starts_with_upper:
                    continue

                dword_lower = dword.lower()
                if dword_lower not in words or words[dword_lower].number_with_yo < 20:
                    continue

            if 'гренадер' in dword:
                continue

            replace = {
                'yoword': yoword,
                'wordStartIndex': start,
                'frequency': yoword.frequency()
            }
            replaces.append(replace)

    result = {
        'replaces': replaces,
        'is_text_changed': len(replaces) > 0
    }
    return result


def yoficate_text(text, **kwargs):
    result = get_replaces(text, **kwargs)
    replaces = result['replaces']

    text_mutable = ctypes.create_unicode_buffer(text)
    for replace in replaces:
        wordStartIndex = replace['wordStartIndex']
        yoword = replace['yoword']
        text_mutable[wordStartIndex:wordStartIndex + len(yoword)] = yoword

    return text_mutable.value, len(replaces)
