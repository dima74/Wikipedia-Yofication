import random
import requests
from flask import Blueprint, request, jsonify, abort, redirect
from src.yofication import get_replaces, deyoficate, get_remote_file_lines

wikipedia = Blueprint('wikipedia', __name__)
WIKIPEDIA_HOST = 'https://ru.wikipedia.org'


def create_all_pages():
    def parse_page(line):
        first_space_index = line.index(' ')
        number_replaces = int(line[:first_space_index])
        page_name = line[first_space_index + 1:]
        return [number_replaces, page_name]

    # в файле хранятся строки --- пары (имя страницы, число замен в ней для минимальной частоты, равной 50%)
    # причём эти пары уже отсортированы в обратном порядке по числу замен
    lines = get_remote_file_lines('all-pages.txt')
    all_pages = list(map(parse_page, lines))

    # для каждого числа k от 0 до <максимальное число замен в страницах> найдём число страниц n, у которых больше чем k замен
    # чтобы в /randomPageName выбирать только из этих n страниц
    maximum_number_replaces = all_pages[0][0]
    number_pages_with_number_replaces_more_than = [None] * (maximum_number_replaces + 1)
    number_replaces = maximum_number_replaces
    for i, page in enumerate(all_pages):
        # нашли первую страницу, у которой меньше чем number_replaces замен
        while number_replaces > page[0]:
            number_pages_with_number_replaces_more_than[number_replaces] = i + 1
            number_replaces -= 1
    while number_replaces >= 0:
        number_pages_with_number_replaces_more_than[number_replaces] = len(all_pages)
        number_replaces -= 1

    return [page[1] for page in all_pages]


all_pages = create_all_pages()


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
    minimum_number_replaces_for_continuous_yofication = int(request.args.get('minimumNumberReplacesForContinuousYofication', 0))
    minimum_number_replaces_for_continuous_yofication = max(minimum_number_replaces_for_continuous_yofication, 0)
    minimum_number_replaces_for_continuous_yofication = min(minimum_number_replaces_for_continuous_yofication, maximum_number_replaces)
    number_pages_to_choice = number_pages_with_number_replaces_more_than[minimum_number_replaces_for_continuous_yofication]
    i = random.randrange(0, number_pages_to_choice)
    return all_pages[i]


default_minimum_replace_frequency = 50


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
        'yowordsToReplaces': generateReplaces(wikitext, minimum_replace_frequency),
        'wikitextLength': len(wikitext)
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
        contextLength = 30
        replace = {
            'wordStartIndex': wordStartIndex,
            'contextBefore': wikitext[max(wordStartIndex - contextLength, 0):wordStartIndex],
            'contextAfter': wikitext[wordEndIndex:min(wordEndIndex + contextLength, len(wikitext))]
        }

        replaces = yowordsToReplaces[yoword]['replaces']
        replaces.append(replace)

        # print(yoword, '`' + page_text[wordStartIndex - 20:wordStartIndex + 20] + '`')

    return yowordsToReplaces


def get_wiktionary_article(yoword):
    params = {
        'format': 'json',
        'action': 'query',
        'list': 'search',
        'srwhat': 'text',
        'srsearch': yoword
    }
    r = requests.get('https://ru.wiktionary.org/w/api.php', params=params)
    results = r.json()['query']['search']
    if len(results) == 0:
        return None
    article = results[0]['title']
    return article


@wikipedia.route('/wikipedia/redirectToWiktionaryArticle/<yoword>')
def redirect_to_wiktionary_article(yoword):
    article = get_wiktionary_article(yoword)
    if article is None:
        return 'ничего не найдено'
    else:
        url = 'https://ru.wiktionary.org/wiki/' + article
        return redirect(url)


@wikipedia.route('/wikipedia/wiktionaryArticle/<yoword>')
def wiktionary_article(yoword):
    return get_wiktionary_article(yoword)
