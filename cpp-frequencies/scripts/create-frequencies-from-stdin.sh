#!/bin/sh -e
cd `dirname $0`/..
mkdir -p results
cmake-build-debug/frequencies >results/frequencies.txt