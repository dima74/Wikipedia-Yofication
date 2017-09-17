import difflib
import requests
import sys
import time
from colorama import Fore, Style

from src.yofication import yoficate_text


class AbuseFilterException(Exception):
    pass


class RateLimitedException(Exception):
    pass


class Yoficator:
    def __init__(self, host, min_frequency=70):
        self.session = requests.Session()
        self.host = host
        self.min_frequency = min_frequency

    def add_parameter(self, kwargs, parameter, what):
        if parameter in kwargs:
            kwargs[parameter].update(what)
        else:
            kwargs[parameter] = what

    def get(self, url='/api.php', **kwargs):
        self.add_parameter(kwargs, 'params', {'format': 'json'})
        request = self.session.get(self.host + url, **kwargs)
        return request

    def post(self, url='/api.php', **kwargs):
        self.add_parameter(kwargs, 'data', {'format': 'json'})
        return self.session.post(self.host + url, **kwargs)

    def login(self, username, password):
        # logintoken
        # request = self.get(params={'format': 'json', 'action': 'query', 'meta': 'tokens', 'type': 'login'})
        # token = request.json()['query']['tokens']['logintoken']

        # login
        data = {
            'format': 'json',
            'action': 'login',
            'lgname': username,
            'lgpassword': password
        }
        request = self.post(data=data)
        data['lgtoken'] = request.json()['login']['token']
        self.session.cookies.set('local_session', request.json()['login']['sessionid'])

        request = self.post(data=data)
        assert request.json()['login']['result'] == 'Success'
        self.session.cookies.set('minecraft_ru_gamepedia_BPsession', request.json()['login']['sessionid'])

        request = self.get(params={'action': 'query', 'meta': 'tokens'})
        assert request.json()['query']['tokens']['csrftoken'] != '+\\'
        print(Fore.LIGHTCYAN_EX + 'Успешно вошли в вики!' + Style.RESET_ALL)

    def editPage(self, title, text, timestamp=None):
        request = self.get(params={'action': 'query', 'meta': 'tokens'}).json()
        token = request['query']['tokens']['csrftoken']

        data = {
            'action': 'edit',
            'title': title,
            'summary': 'Ёфикация',
            'minor': 'true',
            'text': text,
            'token': token
        }
        if timestamp is not None:
            data['basetimestamp'] = timestamp
        request = self.post(data=data).json()
        if request.get('error', {}).get('code', '') == 'ratelimited':
            raise RateLimitedException
        info = request['edit']
        if info.get('code', '') == 'abusefilter-disallowed':
            print(request)
            raise AbuseFilterException
        try:
            assert info['result'] == 'Success'
            return info['oldrevid'], request['edit']['newrevid']
        except Exception:
            print(request)
            exit(0)

    def yoficate_all_pages_consistently(self, number_pages=0, namespace=0):
        last_title = ''
        pages_eficated = 0

        try:
            for title in self.all_pages_generator(start_from='IndustrialCraft 2/Высоковольтный провод', namespace=namespace):
                if title == '':
                    continue

                last_title = title
                request = self.get(params={'action': 'query', 'prop': 'info|revisions', 'titles': title, 'rvprop': 'timestamp|ids|content', 'inprop': 'protection'}).json()
                try:
                    info = list(request['query']['pages'].values())[0]
                    revision = info['revisions'][0]
                    text = revision['*']
                    timestamp = revision['timestamp']

                    if title == 'Сплэш':
                        print('\nПропускается Сплэш')
                        continue

                    text_yoficated, number_replaces = yoficate_text(text, min_frequency=self.min_frequency)
                    if text == text_yoficated:
                        print('.', end='')
                        sys.stdout.flush()
                        continue
                except Exception as e:
                    print('\nПропускается "{}": {}'.format(title, repr(e)))
                    continue

                try:
                    # self.editPage(title, text_yoficated, timestamp)

                    diff = list(difflib.ndiff(text.splitlines(keepends=True), text_yoficated.splitlines(keepends=True)))
                    print()
                    print(''.join(diff))

                    print('\n' + Fore.LIGHTCYAN_EX + title + Style.RESET_ALL)
                    pages_eficated += 1
                    if pages_eficated == number_pages:
                        return
                        # time.sleep(5)
                except AbuseFilterException:
                    print('\nПропускается {}: сработал '.format(title) + Fore.RED + 'abusefilter' + Style.RESET_ALL)
                    continue
                except RateLimitedException:
                    print('\nПропускается {}: сработал '.format(title) + Fore.RED + 'ratelimited filter' + Style.RESET_ALL)
                    time.sleep(20)
                    continue
        except KeyboardInterrupt:
            print("\n{}".format(last_title))
            exit(0)

    def all_pages_generator(self, start_from='', namespace=0):
        apfrom = start_from
        while True:
            request = self.get(params={'action': 'query', 'list': 'allpages', 'apfrom': apfrom, 'apnamespace': namespace, 'aplimit': 500}).json()
            for page in request['query']['allpages']:
                yield page['title']
            if 'continue' not in request:
                return
            apfrom = request['continue']['apcontinue']

    def rename_files(self):
        for filename in self.all_pages_generator(namespace=6):
            filename_yoficated, number_replaces = yoficate_text(filename)
            if number_replaces > 0:
                request = self.get(params={'action': 'query', 'prop': 'info', 'titles': filename_yoficated}).json()
                if 'missing' in list(request['query']['pages'].values())[0]:
                    print(filename_yoficated)

                    # token
                    request = self.get(params={'action': 'query', 'meta': 'tokens'}).json()
                    token = request['query']['tokens']['csrftoken']

                    request = self.post(data={'action': 'move', 'from': filename, 'to': filename_yoficated, 'reason': 'Ёфикация', 'movetalk': 'true', 'token': token})

    def print_titles_to_rename(self):
        for title in self.all_pages_generator():
            title_yoficated, number_replaces = yoficate_text(title)
            if number_replaces > 0:
                print(title)
