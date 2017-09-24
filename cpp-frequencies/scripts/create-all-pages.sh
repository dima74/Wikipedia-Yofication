#!/bin/sh -e
cd `dirname $0`/..
mkdir -p results
cat results/ruwiki-my.txt | cmake-build-debug/all_pages >results/all-pages.txt