#!/bin/sh -e
cd `dirname $0`
sed -i '/-g/s/^/#/w /dev/stdout' ../CMakeLists.txt
sed -i '/-O3/s/^#//w /dev/stdout' ../CMakeLists.txt
rm -rf ../results
rm -rf ../replaces
rm -rf ../cmake-build-debug
./cmake-init.sh
./create-frequencies-from-remote.sh
#./create-ruwiki-my.sh
#./create-frequencies.sh
#./create-replaces.sh