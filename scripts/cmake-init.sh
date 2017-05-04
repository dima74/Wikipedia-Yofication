#!/bin/sh -e
cd `dirname $0`/..
sed -i '/-g/s/^/#/w /dev/stdout' CMakeLists.txt
sed -i '/-O3/s/^#//w /dev/stdout' CMakeLists.txt
rm -rf cmake-build-debug
mkdir cmake-build-debug
cd cmake-build-debug
cmake ..
cd ..
cmake --build cmake-build-debug --target all