import os
import random

import requests
from flask import Blueprint, request, jsonify, abort, redirect, make_response
from mixpanel import Mixpanel

from src.helpers import fetch_lines
from src.yofication import get_replaces, deyoficate, words


def track(*args, **kwargs):
    if mp and not is_marked():
        mp.track(*args, **kwargs)


mp = Mixpanel(os.environ['MIXPANEL_TOKEN']) if 'MIXPANEL_TOKEN' in os.environ else None

wikipedia = Blueprint('wikipedia', __name__)
WIKIPEDIA_HOST = 'https://ru.wikipedia.org'


def create_all_pages():
    global all_pages
    global maximum_number_replaces
    global number_pages_with_number_replaces_more_than

    def parse_page(line):
        first_space_index = line.index(' ')
        number_replaces = int(line[:first_space_index])
        page_name = line[first_space_index + 1:]
        return [number_replaces, page_name]

    # в файле хранятся строки --- пары (имя страницы, число замен в ней для минимальной частоты, равной 50%)
    # причём эти пары уже отсортированы в обратном порядке по числу замен
    lines = fetch_lines(f'https://github.com/dima74/Wikipedia-Yofication/raw/frequencies/all-pages.txt')
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

    all_pages = [page[1] for page in all_pages]


create_all_pages()


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
    track(str(minimum_number_replaces_for_continuous_yofication), 'random_page_name')
    minimum_number_replaces_for_continuous_yofication = max(minimum_number_replaces_for_continuous_yofication, 0)
    minimum_number_replaces_for_continuous_yofication = min(minimum_number_replaces_for_continuous_yofication, maximum_number_replaces)
    number_pages_to_choice = number_pages_with_number_replaces_more_than[minimum_number_replaces_for_continuous_yofication]
    i = random.randrange(0, number_pages_to_choice)
    return all_pages[i]


default_minimum_replace_frequency = 50


@wikipedia.route('/wikipedia/replacesByTitle/<path:title>')
def generateReplacesByTitle(title):
    minimum_replace_frequency = int(request.args.get('minimumReplaceFrequency', default_minimum_replace_frequency))
    track(str(minimum_replace_frequency), 'replaces_by_title', {'title': title})

    # todo get занимает большую часть времени метода
    response = get('/w/api.php', params={'action': 'query', 'prop': 'revisions', 'titles': title, 'rvprop': 'ids|content|timestamp'}).json()
    page_info = list(response['query']['pages'].values())[0]['revisions'][0]
    wikitext = page_info['*']

    revision = page_info['revid']
    timestamp = page_info['timestamp']
    result = {
        'revision': revision,
        'timestamp': timestamp,
        'replaces': generateReplaces(wikitext, minimum_replace_frequency),
        'wikitextLength': len(wikitext)
    }
    return jsonify(result)


@wikipedia.route('/wikipedia/replacesByWikitext', methods=['POST'])
def generateReplacesByWikitext():
    if 'minimumReplaceFrequency' not in request.form:
        abort(400)
    minimum_replace_frequency = int(request.form.get('minimumReplaceFrequency', default_minimum_replace_frequency))
    track(str(minimum_replace_frequency), 'replaces_by_wikitext', {'title': request.form.get('currentPageName', 'unknown')})
    wikitext = request.form['wikitext']
    result = {
        'replaces': generateReplaces(wikitext, minimum_replace_frequency),
        'wikitextLength': len(wikitext)
    }
    return jsonify(result)


def generateReplaces(wikitext, minimum_replace_frequency):
    """
    result = [
        {
            yoword: <str>,
            frequency: <number>,
            wordStartIndex: <number>,
        },
        ...
    ]
    """

    yofication_info = get_replaces(wikitext, minimum_replace_frequency=minimum_replace_frequency)
    replaces = yofication_info['replaces']
    return replaces


def get_wiktionary_article_by_prefix(prefix):
    params = {
        'format': 'json',
        'action': 'query',
        'generator': 'allpages',
        'gapprefix': prefix
    }
    response = requests.get('https://ru.wiktionary.org/w/api.php', params=params).json()
    if 'query' not in response or 'pages' not in response['query']:
        return None

    results = response['query']['pages']
    if len(results) == 0:
        return None

    result = next(iter(results.values()))
    return result['title']


def get_wiktionary_article(yoword):
    while len(yoword) > 0:
        article = get_wiktionary_article_by_prefix(yoword)
        if article:
            return article
        yoword = yoword[:-1]
    return None


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


@wikipedia.route('/stat/<word>')
def get_word_frequency(word):
    word = deyoficate(word)
    if word not in words:
        return 'Нет информации о слове'
    else:
        yoword = words[word]
        return f'''\n\n
частота: {yoword.frequency()}%
is_safe: {'yes' if yoword.is_safe else ('no' if yoword.is_safe == False else 'unknown')}


общее число вхождений: {yoword.number_all}
число вхождений с ё: {yoword.number_with_yo}
'''.replace('\n', '<br>')


def is_marked():
    return 'yofication_mark' in request.cookies


@wikipedia.route('/wikipedia/mark')
def mark():
    response = make_response('Successfully marked')
    response.set_cookie('yofication_mark')
    return response


@wikipedia.route('/wikipedia/is_marked')
def check_is_marked():
    return str(is_marked())
