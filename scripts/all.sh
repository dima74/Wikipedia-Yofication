#!/bin/sh -e
cd `dirname $0`
sed -i '/-g/s/^/#/w /dev/stdout' ../CMakeLists.txt | read
sed -i '/-O3/s/^#//w /dev/stdout' ../CMakeLists.txt | read
./cmake-init.sh
./create-ruwiki-my.sh
./create-frequencies.sh
./create-replaces.sh