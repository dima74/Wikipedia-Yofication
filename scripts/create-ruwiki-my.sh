#!/bin/sh -e
# https://dumps.wikimedia.org/backup-index.html
# ruwiki -> ruwiki-*-pages-articles.xml.bz2
mkdir -p results bin
g++ -O3 src/converter.cpp -o bin/converter
curl https://dumps.wikimedia.org/ruwiki/20170201/ruwiki-20170201-pages-articles.xml.bz2 | bunzip2 | bin/converter >results/ruwiki-my.txt