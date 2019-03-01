from src.helpers import fetch_lines


def process_word(word, callback):
    only_lowercase = word[0] == '_'
    if only_lowercase:
        word = word[1:]

    callback(word)
    if not only_lowercase and word.islower():
        word_capitalized = word[0].upper() + word[1:]
        callback(word_capitalized)


def process_template(word, callback):
    if '#' in word:
        word = word[:word.index('#')].strip()

    bracket_index = word.find('(')
    if bracket_index != -1:
        suffixes = word[bracket_index + 1:-1]
        word = word[:bracket_index]
        for suffix in suffixes:
            process_word(word + suffix, callback)
    else:
        process_word(word, callback)


def get_hcodes_yowords():
    yowords = []
    sources = [('safe.txt', True), ('not_safe.txt', False)]
    for source_file, is_safe in sources:
        lines = fetch_lines(f'https://github.com/hcodes/eyo-kernel/raw/master/dict_src/{source_file}')
        callback = lambda yoword: yowords.append((yoword, is_safe))
        for line in lines:
            process_template(line, callback)
    return yowords
