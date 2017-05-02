#!/bin/sh -e
cd `dirname $0`/..
mkdir cmake-build-debug
cd cmake-build-debug
cmake ..
cd ..
cmake --build cmake-build-debug --target all