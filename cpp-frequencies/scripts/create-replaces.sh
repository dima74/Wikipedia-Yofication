#!/bin/sh -e
cd `dirname $0`/..
rm -rf replaces/replacesByTitles replaces/pagesToEfication replaces/numberPages
mkdir -p replaces/pagesToEfication replaces/replacesByTitles
cmake-build-debug/replaces_printer <results/ruwiki-my.txt