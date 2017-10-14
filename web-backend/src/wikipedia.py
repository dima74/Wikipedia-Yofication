import random
import requests
from flask import Blueprint, request, jsonify, abort
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


default_minimum_replace_frequency = 25


@wikipedia.route('/wikipedia/replacesByTitle/<path:title>')
def generateReplacesByTitle(title):
    minimum_replace_frequency = int(request.args.get('minimumReplaceFrequency', default_minimum_replace_frequency))

    # todo get занимает большую часть времени метода
    response = get('/w/api.php', params={'action': 'query', 'prop': 'revisions', 'titles': title, 'rvprop': 'ids|content|timestamp'}).json()
    page_info = list(response['query']['pages'].values())[0]['revisions'][0]
    wikitext = page_info['*']

    revision = page_info['revid']
    timestamp = page_info['timestamp']
    result = {
        'revision': revision,
        'timestamp': timestamp,
        'yowordsToReplaces': generateReplaces(wikitext, minimum_replace_frequency)
    }
    return jsonify(result)


@wikipedia.route('/wikipedia/replacesByWikitext', methods=['POST'])
def generateReplacesByWikitext():
    if 'minimumReplaceFrequency' not in request.form:
        abort(400)
    minimum_replace_frequency = int(request.form.get('minimumReplaceFrequency', default_minimum_replace_frequency))
    wikitext = request.form['wikitext']
    return jsonify(generateReplaces(wikitext, minimum_replace_frequency))


def generateReplaces(wikitext, minimum_replace_frequency):
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

    yofication_info = get_replaces(wikitext, minimum_replace_frequency=minimum_replace_frequency)
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
            'contextBefore': wikitext[max(wordStartIndex - contextLength, 0):wordStartIndex],
            'contextAfter': wikitext[wordEndIndex:min(wordEndIndex + contextLength, len(wikitext))]
        }

        replaces = yowordsToReplaces[yoword]['replaces']
        replaces.append(replace)

        # print(yoword, '`' + page_text[wordStartIndex - 20:wordStartIndex + 20] + '`')

    return yowordsToReplaces
