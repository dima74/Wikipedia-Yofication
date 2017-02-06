#!/bin/sh -e
cd `dirname $0`
./cmake-init.sh
./create-ruwiki-my.sh
./create-frequencies.sh