#!/bin/sh -e
cd `dirname $0`/..
curl https://dumps.wikimedia.org/ruwiki/20170901/ruwiki-20170901-pages-articles.xml.bz2 | bunzip2 | cmake-build-debug/converter