import json
import requests
from flask import Flask, jsonify, abort
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


def getReplaces(info, title):
    revision = info['revid']
    text = info['*']

    p = Popen(['/home/dima/Wikipedia-Efication/cmake-build-debug/create_replaces_for_page'], stdout=PIPE, stdin=PIPE, stderr=STDOUT, cwd=r'/home/dima/Wikipedia-Efication')
    number_lines = text.count('\n') + 1
    input = '{}\n{} {}\n{}'.format(title, revision, number_lines, text).encode('utf-8')
    ouput = p.communicate(input=input)[0]
    return ouput.decode()


@app.route('/<path:title>')
def main(title):
    r = get('/w/api.php', params={'action': 'query', 'prop': 'revisions', 'titles': title, 'rvprop': 'ids|content'}).json()
    info = list(r['query']['pages'].values())[0]['revisions'][0]
    replaces = getReplaces(info, title)
    if len(json.loads(replaces)['replaces']) == 0:
        abort(404)
    return replaces


if __name__ == '__main__':
    app.run(debug=True, port=5001)
