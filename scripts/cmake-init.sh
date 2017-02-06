#!/bin/sh -e
cd `dirname $0`
cd ..
mkdir cmake-build-debug
cd cmake-build-debug
cmake ..
cd ..