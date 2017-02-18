#!/bin/sh -e
cd `dirname $0`
cd ..
cmake --build cmake-build-debug --target replaces_printer
rm -rf replaces
mkdir -p replaces/pagesToEfication replaces/replacesByTitles
cmake-build-debug/replaces_printer