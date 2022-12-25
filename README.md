# Скрипт-Ёфикатор для Википедии

[![CircleCI](https://circleci.com/gh/dima74/Wikipedia-Yofication.svg?style=svg)](https://circleci.com/gh/dima74/Wikipedia-Yofication)
[![Website](https://img.shields.io/website-up-down-green-red/https/yofication-diralik.amvera.io.svg)](https://yofication-diralik.amvera.io/)

# Описание

Скрипт-Ёфикатор это [персональный скрипт](https://ru.wikipedia.org/wiki/Википедия:Персональные_скрипты) для Википедии, производящий [ёфикацию](https://ru.wikipedia.org/wiki/Ёфикатор) в полуавтоматическом режиме. Ёфикация это процесс замены буквы «е» на букву «ё», в соответствии с правилами русского языка.

# Использование
1. [Зарегистрируйтесь](https://ru.wikipedia.org/w/index.php?title=Служебная:Создать_учётную_запись) в Википедии.
2. Откройте страницу [common.js](https://ru.wikipedia.org/wiki/Служебная:Моя_страница/common.js).
3. Нажмите «Создать как викитекст».
4. Появится редактор, добавьте следующую строчку, затем нажмите «записать страницу».

        importScript('Участник:Дима74/yoficator.js'); //linkback [[Участник:Дима74/yoficator.js]]
    
5. Перейдите на страницу [Служебная:Ёфикация](https://ru.wikipedia.org/wiki/Служебная:Ёфикация).
6. Вас автоматически перенаправит на случайную страницу, чтобы вы её ёфицировали.
7. Когда страница загрузится, будет выполнена прокрутка до слова, которое предлагается ёфицировать. Слово будет выделено ярко-синим цветом.
8. Далее вам доступны две горячие клавиши:

        j   принять замену
        f   отменить замену

9. Проверьте, что замена корректна, и нажмите соответствующую клавишу.
10. После нажатия `j` или `f` будет найдено следующее слово для ёфикации, и страница будет прокручена до него. Если больше нет слов для ёфикации, будет произведена правка страницы от вашего имени (это может занять некоторое время), затем произойдёт перенаправление на следующую страницу для ёфикации.

# Продвинутое использование
* Больше информации можно найти на [странице скрипта в Википедии](https://ru.wikipedia.org/wiki/Участник:Дима74/Скрипт-Ёфикатор).
* Если вы хотите ёфицировать какую-то конкретную статью, просто перейдите на неё, откройте редактор викитекста и нажмите на значок буквы «ё» в панели редактора.

# Как скрипт находит слова для ёфикации?
Используются два источника:
* [ежемесячно обновляемая статистика встречаемости слов](https://github.com/dima74/Wikipedia-Yofication/tree/frequencies) в [дампе Википедии](https://dumps.wikimedia.org/backup-index.html)
* [словарь](https://github.com/hcodes/eyo-kernel/tree/master/dict_src) библиотеки [hcodes/eyo-kernel](https://github.com/hcodes/eyo-kernel), опубликованной под лицензией MIT.
