#!/bin/sh -e
cd `dirname $0`
rm -rf ../replaces

#ruwiki_creator_script=./download-ruwiki-my-to-stdout.sh
ruwiki_creator_script=./print-ruwiki-my-from-bz2-file-to-stdout.sh

./cmake-init.sh
eval $ruwiki_creator_script | ./create-all-yowords-from-stdin.sh
eval $ruwiki_creator_script | ./create-all-pages-from-stdin.sh
eval $ruwiki_creator_script | ./create-frequencies-from-stdin.sh