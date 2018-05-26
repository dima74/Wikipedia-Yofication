#!/bin/bash -e
set -x
cd `dirname $0`
rm -rf ../replaces

ruwiki_creator_script=./download-ruwiki-my-to-stdout.sh
#ruwiki_creator_script=./print-ruwiki-my-from-bz2-file-to-stdout.sh

./cmake-init.sh
# TODO удалить это после перемещения на travis-ci.com
# # для создания списка статей для ёфикации используем частоты, сгенерированные предыдущей сборкой
# # TODO переместиться на travis-ci.com, максимальное время сборки увеличится до 120 минут и можно будет за сборку два раза скачивать дамп Википедии
# wget https://github.com/dima74/Wikipedia-Yofication/raw/frequencies/frequencies.txt -q -P ../
# wc ../frequencies.txt
# [ -s ../frequencies.txt ]  # check for non empty

# https://superuser.com/a/7458/734823
# так обычно не работает (frequencies.txt получается пустым)
# eval $ruwiki_creator_script | tee >(./create-frequencies-from-stdin.sh) >(./create-all-pages-from-stdin.sh) >/dev/null

eval $ruwiki_creator_script | ./create-frequencies-from-stdin.sh
#eval $ruwiki_creator_script | ./create-all-pages-from-stdin.sh
wc ../results/*