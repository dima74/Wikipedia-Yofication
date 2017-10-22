#!/bin/sh -e
cd `dirname $0`/..
curl https://dumps.wikimedia.org/ruwiki/20171020/ruwiki-20171020-pages-articles.xml.bz2 | bunzip2 | cmake-build-debug/converter