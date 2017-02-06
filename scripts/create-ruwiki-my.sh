#!/bin/sh -e
cd `dirname $0`
cd ..
# https://dumps.wikimedia.org/backup-index.html
# ruwiki -> ruwiki-*-pages-articles.xml.bz2
mkdir results
cmake --build cmake-build-debug --target converter
curl https://dumps.wikimedia.org/ruwiki/20170201/ruwiki-20170201-pages-articles.xml.bz2 | bunzip2 | cmake-build-debug/converter >results/ruwiki-my.txt