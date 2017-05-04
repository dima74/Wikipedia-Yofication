#!/bin/sh -e
cd `dirname $0`/..
cmake-build-debug/all_ewords <results/ruwiki-my.txt >results/all-ewords.txt