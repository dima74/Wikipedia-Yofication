import json
import requests
from flask import Flask, jsonify, abort, request
from subprocess import Popen, PIPE, STDOUT

app = Flask(__name__)

WIKIPEDIA_HOST = 'https://ru.wikipedia.org'


def add_parameter_format_json(kwargs, parameter):
    if parameter in kwargs:
        kwargs[parameter].update({'format': 'json'})
    else:
        kwargs[parameter] = {'format': 'json'}


def get(url='/w/api.php', **kwargs):
    add_parameter_format_json(kwargs, 'params')
    return requests.get(WIKIPEDIA_HOST + url, **kwargs)


def getReplaces(info, title, min_replace_frequency):
    revision = info['revid']
    text = info['*']

    p = Popen(['/home/dima/Wikipedia-Efication/cmake-build-debug/replaces_printer_for_page'], stdout=PIPE, stdin=PIPE, stderr=STDOUT, cwd=r'/home/dima/Wikipedia-Efication')
    number_lines = text.count('\n') + 1
    input = '{}\n{}\n{} {}\n{}'.format(min_replace_frequency, title, revision, number_lines, text).encode('utf-8')
    ouput = p.communicate(input=input)[0]
    return ouput.decode()


@app.route('/<path:title>')
def main(title):
    min_replace_frequency = request.args['minReplaceFrequency'] if 'minReplaceFrequency' in request.args else 0.6
    r = get('/w/api.php', params={'action': 'query', 'prop': 'revisions', 'titles': title, 'rvprop': 'ids|content'}).json()
    info = list(r['query']['pages'].values())[0]['revisions'][0]
    replaces = getReplaces(info, title, min_replace_frequency)
    if len(json.loads(replaces)['replaces']) == 0:
        abort(404)
    return replaces


if __name__ == '__main__':
    app.run(debug=True)
