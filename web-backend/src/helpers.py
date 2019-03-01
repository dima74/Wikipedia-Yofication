import requests


def fetch_lines(url):
    response = requests.get(url)
    assert response.status_code == 200
    return [line for line in response.text.split('\n') if line]
