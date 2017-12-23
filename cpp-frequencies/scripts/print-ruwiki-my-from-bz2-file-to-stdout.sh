#!/bin/sh -e
cd `dirname $0`/..
bunzip2 <results/ruwiki-pages-articles.xml.bz2 | cmake-build-debug/converter