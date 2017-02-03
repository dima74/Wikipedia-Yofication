#!/bin/zsh -e
# https://dumps.wikimedia.org/backup-index.html
# ruwiki -> ruwiki-*-pages-articles.xml.bz2
g++ -O3 converter.cpp -o converter
curl https://dumps.wikimedia.org/ruwiki/20170201/ruwiki-20170201-pages-articles.xml.bz2 | bunzip2 | ./converter
rm converter