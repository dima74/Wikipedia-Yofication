#!/bin/bash
set -e
set -x

FREQUENCIES_DIRECTORY=/tmp/frequencies

git config --global user.email "<>"
git config --global user.name "Frequencies bot"
git clone --quiet --depth=1 --branch=frequencies https://${GH_TOKEN}@github.com/${GH_USER}/${GH_REPO}.git $FREQUENCIES_DIRECTORY
cp results/* $FREQUENCIES_DIRECTORY
cd $FREQUENCIES_DIRECTORY

ls -sh1
wc *
# check for non empty: https://stackoverflow.com/a/27710284/5812238
[[ -s frequencies.txt ]]
[[ -s all-pages.txt ]]
[[ -s pages-for-words-with-few-replaces.json ]]

git add .
git commit -m "Build $CIRCLE_BUILD_NUM" || echo "No changes to commit"
git push
