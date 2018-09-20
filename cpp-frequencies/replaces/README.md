# Wikipedia-Efication-Replaces
В этом репозитории находятся замены для [ёфикатора](https://github.com/dima74/Wikipedia-Efication)

# Формат замен
* В файле `numberPages` записано число страниц, для которых есть замены
* В папке `pagesToEfication` находятся файлы с именами `{0, ..., numberPages - 1}`, в каждом из них записан заголовок некоторой статьи
* В папке `replacesByTitles` находятся файлы замен, название каждого файла является заголовком некоторой статьи, содержимое файла представляет собой json-объект следующего формата:

        {
          "replaces": [
            {
              "yoword": " тёплый ",
              "frequency": 75,
              "indexWordStart": 19847,
              "numberSameDwords": 1,
              "numberSameDwordsBefore": 0
            }
          ],
          "revision": 83022944,
          "title": "16 августа"
        }

  * `title` --- заголовок статьи
  * `revision` --- id ревизии, для которой вычислялись замены
  * `replaces` --- массив замен
  * каждая замена --- это json-объект:
    * `indexWordStart` --- индекс (в викитексте) в котором начинается слово, которое предлагается заменить
    * `yoword` --- слово на которое предлагается заменить
    * `frequency` --- частота вхождений версии слова `yoword` с ё в статьях Википедии, выраженная в процентах