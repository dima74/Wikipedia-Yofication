#!/bin/sh -e
cd `dirname $0`
rm -rf ../replaces
./cmake-init.sh
./create-all-yowords-from-remote.sh
./create-all-pages-from-remote.sh
./create-frequencies-from-remote.sh
#./create-ruwiki-my.sh
#./create-frequencies.sh
#./create-replaces.sh