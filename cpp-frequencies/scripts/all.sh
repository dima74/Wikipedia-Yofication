#!/bin/bash -e
cd `dirname $0`
rm -rf ../replaces

ruwiki_creator_script=./download-ruwiki-my-to-stdout.sh
#ruwiki_creator_script=./print-ruwiki-my-from-bz2-file-to-stdout.sh

./cmake-init.sh
# https://superuser.com/a/7458/734823
eval $ruwiki_creator_script | tee >(./create-frequencies-from-stdin.sh) >(./create-all-pages-from-stdin.sh) >/dev/null
