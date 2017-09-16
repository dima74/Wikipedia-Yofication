from src.base import Yoficator

yoficator = Yoficator('http://minecraft-ru.gamepedia.com')
yoficator.login('Yoficator@Ёфикатор', '5c4nuatnjdor8fgv6iptm4nkg26q54h2')
yoficator.yoficate_all_pages_consistently(namespace=10)
