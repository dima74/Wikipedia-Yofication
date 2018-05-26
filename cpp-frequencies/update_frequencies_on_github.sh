#!/bin/sh -e
set -x
cd `dirname $0`

./BUILD.sh
git config --global user.email "travis@travis-ci.org"
git config --global user.name "Travis"
git clone --quiet --depth=1 --branch=frequencies https://${GH_TOKEN}@github.com/${GH_USER}/${GH_REPO}.git $HOME/frequencies
cp results/* $HOME/frequencies
cd $HOME/frequencies

# https://stackoverflow.com/a/27710284/5812238
wc *
[ -s frequencies.txt ]  # check for non empty
[ -s all-pages.txt ]  # check for non empty

git add .
git commit -m "Travis build $TRAVIS_BUILD_NUMBER" || echo "No changes to commit"
git push
