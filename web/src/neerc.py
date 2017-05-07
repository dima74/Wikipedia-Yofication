import difflib
import requests
from termcolor import colored, cprint
from colorama import init, Fore, Back, Style

from src.yofication import yoficate_text

WIKIPEDIA_HOST = 'http://neerc.ifmo.ru/wiki'
session = requests.Session()


def add_parameter_format_json(kwargs, parameter):
    if parameter in kwargs:
        kwargs[parameter].update({'format': 'json'})
    else:
        kwargs[parameter] = {'format': 'json'}


def get(url='/api.php', **kwargs):
    add_parameter_format_json(kwargs, 'params')
    return session.get(WIKIPEDIA_HOST + url, **kwargs)


def post(url='/api.php', **kwargs):
    add_parameter_format_json(kwargs, 'data')
    return session.post(WIKIPEDIA_HOST + url, **kwargs)


def editPage(title, text, timestamp):
    # request = get(params={'action': 'query', 'prop': 'info'}).json()
    # print(request)
    # token = request['query']['tokens']['csrftoken']
    token = '+\\'

    data = {
        'action': 'edit',
        'title': title,
        'summary': 'Ёфикация',
        'minor': 'true',
        'text': text,
        # 'basetimestamp': timestamp,
        'token': token
    }
    request = post(data=data)
    print(request.status_code, request.json())

    # for i in range(10):
    data['captchaid'] = request.json()['edit']['captcha']['id']
    data['captchaword'] = 'sta'
    request = post(data=data)
    print(request.status_code, request.json())


def yofication():
    for pageId in range(9, 10):
        request = get(params={'action': 'query', 'prop': 'revisions', 'pageids': pageId, 'rvprop': 'timestamp|ids|content'}).json()
        # try:
        info = list(request['query']['pages'].values())[0]
        title = info['title']
        revision = info['revisions'][0]
        text = revision['*']
        timestamp = revision['*']
        text_yoficated = yoficate_text(text, yoficate_words_starts_with_upper=False)
        if text == text_yoficated:
            print('Пропускается {}, уже ёфицирована'.format(pageId))
            continue
        diff = list(difflib.ndiff(text.splitlines(keepends=True), text_yoficated.splitlines(keepends=True)))
        print()
        print(Fore.LIGHTCYAN_EX + title + Style.RESET_ALL)
        print(''.join(line[2:] for line in diff if not line.startswith(' ')))
        editPage(title, text_yoficated, timestamp)
        break
        # except Exception as e:
        #     print('Пропускается {}: {}'.format(pageId, repr(e)))


# yofication()
editPage('Участник:Дмитрий_Мурзин', '1', '')
