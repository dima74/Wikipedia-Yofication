#!/bin/sh -e
cd `dirname $0`/..
mkdir -p results
cmake-build-debug/all_pages >results/all-pages.txt