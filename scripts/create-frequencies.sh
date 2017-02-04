#!/bin/sh -e
mkdir -p results bin
g++ -O3 src/create_frequencies.cpp -o bin/create_frequencies
bin/create_frequencies <results/ruwiki-my.txt >results/frequencies.txt