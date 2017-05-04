#!/bin/sh -e
cd `dirname $0`
rm -rf ../replaces
./cmake-init.sh
./create-replaces-from-remote.sh
#./create-frequencies-from-remote.sh
#./create-ruwiki-my.sh
#./create-frequencies.sh
#./create-replaces.sh