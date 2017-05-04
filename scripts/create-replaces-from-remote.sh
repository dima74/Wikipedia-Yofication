#!/bin/sh -e
cd `dirname $0`/..
rm -rf replaces/replacesByTitles replaces/pagesToEfication replaces/numberPages
mkdir -p replaces/pagesToEfication replaces/replacesByTitles
curl https://dumps.wikimedia.org/ruwiki/20170501/ruwiki-20170501-pages-articles.xml.bz2 | bunzip2 | cmake-build-debug/converter | cmake-build-debug/replaces_printer