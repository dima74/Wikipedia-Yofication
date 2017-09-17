import json
import random

import requests
from subprocess import Popen, PIPE, STDOUT
from flask import Blueprint, request, abort, jsonify

from src.yofication import yoficate_text_complex

wikipedia = Blueprint('wikipedia', __name__)
WIKIPEDIA_HOST = 'https://ru.wikipedia.org'

with open('/home/dima/Wikipedia-Yofication/cpp-frequencies/results/all-pages.txt') as input:
    all_pages = input.readlines()


def add_parameter_format_json(kwargs, parameter):
    if parameter in kwargs:
        kwargs[parameter].update({'format': 'json'})
    else:
        kwargs[parameter] = {'format': 'json'}


def get(url='/w/api.php', **kwargs):
    add_parameter_format_json(kwargs, 'params')
    return requests.get(WIKIPEDIA_HOST + url, **kwargs)


# def getReplaces(info, title, min_replace_frequency):
#     revision = info['revid']
#     text = info['*']
#
#     p = Popen(['/home/dima/Wikipedia-Yofication/cpp-frequencies/cmake-build-debug/replaces_printer_for_page'], stdout=PIPE, stdin=PIPE, stderr=STDOUT, cwd=r'/home/dima/Wikipedia-Yofication')
#     number_lines = text.count('\n') + 1
#     input = '{}\n{}\n{} {}\n{}'.format(min_replace_frequency, title, revision, number_lines, text).encode('utf-8')
#     output = p.communicate(input=input)[0]
#     return output.decode()


@wikipedia.route('/wikipedia/randomPageName')
def randomPageName():
    return random.choice(all_pages)


@wikipedia.route('/wikipedia/replaces/<path:title>')
def generate(title):
    min_replace_frequency = request.args.get('minReplaceFrequency', 0.6)
    r = get('/w/api.php', params={'action': 'query', 'prop': 'revisions', 'titles': title, 'rvprop': 'ids|content'}).json()
    page_info = list(r['query']['pages'].values())[0]['revisions'][0]
    page_text = page_info['*']
    yofication_info = yoficate_text_complex(page_text, min_replace_frequency=min_replace_frequency)
    if not yofication_info['is_text_changed']:
        abort(404)

    replaces = yofication_info['replaces']
    for replace in replaces:
        dword = replace['yoword'].replace('ё', 'е')
        replace['numberSameDwords'] = page_text.count(dword)
        replace['numberSameDwordsBefore'] = page_text.count(dword, 0, replace['wordStartIndex'])

    revision = page_info['revid']
    result = {
        'replaces': replaces,
        'revision': revision
    }
    return jsonify(result)
