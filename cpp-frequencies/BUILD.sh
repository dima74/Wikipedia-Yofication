#!/bin/sh -e
set -x
cd `dirname $0`

rm -rf results
mkdir results
scripts/download-pages-articles-bz2-to-stdout.sh >results/ruwiki-pages-articles.xml.bz2
scripts/all.sh