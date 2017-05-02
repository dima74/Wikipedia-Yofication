#!/bin/sh -e
cd `dirname $0`/..
mkdir results
curl https://dumps.wikimedia.org/ruwiki/20170420/ruwiki-20170420-pages-articles.xml.bz2 | bunzip2 | cmake-build-debug/converter | cmake-build-debug/frequencies >results/frequencies.txt