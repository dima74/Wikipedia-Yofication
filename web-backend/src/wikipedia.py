import random
import re
import requests
from flask import Blueprint, request, jsonify
from src.yofication import yoficate_text_complex, check_match, deyoficate

wikipedia = Blueprint('wikipedia', __name__)
WIKIPEDIA_HOST = 'https://ru.wikipedia.org'

with open('/home/dima/Wikipedia-Yofication/cpp-frequencies/results/all-pages.txt') as input:
    def parse_page(line):
        first_space_index = line.index(' ')
        number_replaces = int(line[:first_space_index])
        page_name = line[first_space_index:]
        return [number_replaces, page_name]


    lines = input.readlines()
    all_pages = list(map(parse_page, lines))
    all_pages = [page[1] for page in all_pages if page[0] >= 10]


def add_parameter_format_json(kwargs, parameter):
    if parameter in kwargs:
        kwargs[parameter].update({'format': 'json'})
    else:
        kwargs[parameter] = {'format': 'json'}


def get(url='/w/api.php', **kwargs):
    add_parameter_format_json(kwargs, 'params')
    return requests.get(WIKIPEDIA_HOST + url, **kwargs)


@wikipedia.route('/wikipedia/randomPageName')
def random_page_name():
    return random.choice(all_pages)


def count_russian_words(text, word):
    return len([match for match in re.finditer(word, text) if check_match(text, match, word)])


@wikipedia.route('/wikipedia/replaces/<path:title>')
def generate(title):
    min_replace_frequency = int(request.args.get('minReplaceFrequency', 60))
    r = get('/w/api.php', params={'action': 'query', 'prop': 'revisions', 'titles': title, 'rvprop': 'ids|content|timestamp'}).json()
    page_info = list(r['query']['pages'].values())[0]['revisions'][0]
    page_text = page_info['*']
    yofication_info = yoficate_text_complex(page_text, min_replace_frequency=min_replace_frequency)
    # if not yofication_info['is_text_changed']:
    #     abort(404)

    """
    result = {
        revision: <number>,
        yowordsToReplaces: {
            <yoword>: {
                frequency: <number>,
                numberSameDwords: <number>,
                replaces: [
                    {
                        wordStartIndex: <number>,
                        numberSameDwordsBefore: <number>
                    },
                    ...
                ]
            },
            ...
        }
    }
    """

    replaces = yofication_info['replaces']
    yowordsToReplaces = {}
    for replace in replaces:
        yoword = replace['yoword']
        dword = deyoficate(yoword)

        if yoword not in yowordsToReplaces:
            yowordsToReplaces[yoword] = {
                'frequency': replace['frequency'],
                'numberSameDwords': count_russian_words(page_text, dword),
                'replaces': []
            }

        wordStartIndex = replace['wordStartIndex']
        numberSameDwordsBefore = count_russian_words(page_text[:wordStartIndex], dword)
        replace = {
            'wordStartIndex': wordStartIndex,
            'numberSameDwordsBefore': numberSameDwordsBefore
        }

        replaces = yowordsToReplaces[yoword]['replaces']
        replaces.append(replace)

    revision = page_info['revid']
    timestamp = page_info['timestamp']
    result = {
        'revision': revision,
        'timestamp': timestamp,
        'yowordsToReplaces': yowordsToReplaces
    }
    return jsonify(result)
