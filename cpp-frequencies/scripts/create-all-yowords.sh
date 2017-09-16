#!/bin/sh -e
cd `dirname $0`/..
cmake-build-debug/all_yowords <results/ruwiki-my.txt >results/all-yowords.txt