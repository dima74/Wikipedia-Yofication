#!/bin/sh -e
cd `dirname $0`/..
# https://dumps.wikimedia.org/backup-index.html
# ruwiki -> ruwiki-*-pages-articles.xml.bz2
curl https://dumps.wikimedia.org/ruwiki/20171201/ruwiki-20171201-pages-articles.xml.bz2 | bunzip2 | cmake-build-debug/converter