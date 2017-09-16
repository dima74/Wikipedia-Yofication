#!/bin/sh -e
cd `dirname $0`/..
rm -rf replaces/replacesByTitles replaces/pagesToEfication replaces/numberPages
mkdir -p replaces/pagesToEfication replaces/replacesByTitles
./scripts/download-ruwiki-my.sh | cmake-build-debug/replaces_printer