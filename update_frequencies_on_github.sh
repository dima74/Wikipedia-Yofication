#!/bin/bash
set -e
set -x

FREQUENCIES_DIRECTORY=/tmp/frequencies
BUILD_NUMBER=${BUILD_NUMBER:-manual}

rm -rf "$FREQUENCIES_DIRECTORY"
git config --global user.email "<>"
git config --global user.name "Frequencies bot"
git clone --quiet --depth=1 --branch=frequencies "https://x-access-token:${GH_TOKEN}@github.com/${GH_REPO}.git" $FREQUENCIES_DIRECTORY
cp results/* $FREQUENCIES_DIRECTORY
cd $FREQUENCIES_DIRECTORY

ls -sh1
wc *
# check for non empty: https://stackoverflow.com/a/27710284/5812238
[[ -s frequencies.txt ]]
[[ -s all-pages.txt ]]
[[ -s pages-for-words-with-few-replaces.json ]]

git add .
git commit -m "Build $BUILD_NUMBER" || echo "No changes to commit"
git push
