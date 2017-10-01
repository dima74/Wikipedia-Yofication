import random
import requests
from flask import Blueprint, request, jsonify
from src.yofication import get_replaces, deyoficate

wikipedia = Blueprint('wikipedia', __name__)
WIKIPEDIA_HOST = 'https://ru.wikipedia.org'

with open('/home/dima/Wikipedia-Yofication/cpp-frequencies/results/all-pages.txt') as input:
    def parse_page(line):
        first_space_index = line.index(' ')
        number_replaces = int(line[:first_space_index])
        page_name = line[first_space_index + 1:]
        return [number_replaces, page_name]


    lines = input.readlines()
    all_pages = list(map(parse_page, lines))
    all_pages = [page for page in all_pages if page[0] >= 5]
    all_pages = [page[1] for page in all_pages]


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


@wikipedia.route('/wikipedia/replaces/<path:title>')
def generate(title):
    min_replace_frequency = int(request.args.get('minReplaceFrequency', 25))
    # todo get занимает большую часть времени метода
    response = get('/w/api.php', params={'action': 'query', 'prop': 'revisions', 'titles': title, 'rvprop': 'ids|content|timestamp'}).json()
    page_info = list(response['query']['pages'].values())[0]['revisions'][0]
    page_text = page_info['*']
    yofication_info = get_replaces(page_text, min_replace_frequency=min_replace_frequency)
    # if not yofication_info['is_text_changed']:
    #     abort(404)

    """
    result = {
        revision: <number>,
        yowordsToReplaces: {
            <yoword>: {
                frequency: <number>,
                replaces: [
                    {
                        wordStartIndex: <number>,
                        contextBefore: <string>,
                        contextAfter: <string>
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
                'replaces': []
            }

        wordStartIndex = replace['wordStartIndex']
        wordEndIndex = wordStartIndex + len(yoword)
        contextLength = 20
        replace = {
            'wordStartIndex': wordStartIndex,
            'contextBefore': page_text[max(wordStartIndex - contextLength, 0):wordStartIndex],
            'contextAfter': page_text[wordEndIndex:min(wordEndIndex + contextLength, len(page_text))]
        }

        replaces = yowordsToReplaces[yoword]['replaces']
        replaces.append(replace)

        # print(yoword, '`' + page_text[wordStartIndex - 20:wordStartIndex + 20] + '`')

    revision = page_info['revid']
    timestamp = page_info['timestamp']
    result = {
        'revision': revision,
        'timestamp': timestamp,
        'yowordsToReplaces': yowordsToReplaces
    }
    return jsonify(result)
