#!/bin/sh -e
cd `dirname $0`/..
cmake-build-debug/frequencies <results/ruwiki-my.txt >results/frequencies.txt