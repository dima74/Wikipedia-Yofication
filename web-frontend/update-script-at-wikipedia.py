import os

import requests

API = 'https://ru.wikipedia.org/w/api.php'
username = 'Дима74'
password = os.environ['WIKIPEDIA_PASSWORD']
yoficator_page_name = 'Участник:Дима74/yoficator.js'
session = requests.session()


def login():
    # logintoken
    r = session.get(API, params={'format': 'json', 'action': 'query', 'meta': 'tokens', 'type': 'login'})
    token = r.json()['query']['tokens']['logintoken']

    # login
    data = {
        'format': 'json',
        'action': 'clientlogin',
        'loginreturnurl': 'https://ya.ru',
        'logintoken': token,
        'username': username,
        'password': password
    }
    r = session.post(API, data=data)
    print(r.status_code, r.json())


def editPage(title, text):
    # check csrftoken
    r = session.get(API, params={'format': 'json', 'action': 'query', 'meta': 'tokens'}).json()
    csrftoken = r['query']['tokens']['csrftoken']
    assert csrftoken != '+\\'

    # edit
    data = {
        'format': 'json',
        'action': 'edit',
        # 'summary': '',
        'title': title,
        'text': text,
        'token': csrftoken
    }
    r = session.post(API, data=data)
    print(r.status_code, r.json())


login()
script_text = open('dist/yoficator.bundle.js').read()
editPage(yoficator_page_name, script_text)
