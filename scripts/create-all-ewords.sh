#!/bin/sh -e
cd `dirname $0`/..
cmake --build cmake-build-debug --target all_ewords
cmake-build-debug/all_ewords <results/ruwiki-my.txt >results/all-ewords.txt