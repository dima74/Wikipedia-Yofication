#!/bin/sh -e
cmake --build cmake-build-debug --target create_frequencies
cmake-build-debug/create_frequencies <results/ruwiki-my.txt >results/frequencies.txt