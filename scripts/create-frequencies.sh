#!/bin/sh -e
cd `dirname $0`
cd ..
cmake --build cmake-build-debug --target frequencies
cmake-build-debug/frequencies <results/ruwiki-my.txt >results/frequencies.txt