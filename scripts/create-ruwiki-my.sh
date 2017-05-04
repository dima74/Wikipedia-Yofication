#!/bin/sh -e
cd `dirname $0`/..
# https://dumps.wikimedia.org/backup-index.html
# ruwiki -> ruwiki-*-pages-articles.xml.bz2
rm -rf results
mkdir results
curl https://dumps.wikimedia.org/ruwiki/20170420/ruwiki-20170420-pages-articles.xml.bz2 | bunzip2 | cmake-build-debug/converter >results/ruwiki-my.txt
