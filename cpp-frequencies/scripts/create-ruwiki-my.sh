#!/bin/sh -e
cd `dirname $0`/..
# https://dumps.wikimedia.org/backup-index.html
# ruwiki -> ruwiki-*-pages-articles.xml.bz2
rm -rf results
mkdir results
scripts/download-ruwiki-my-to-stdout.sh >results/ruwiki-my.txt
