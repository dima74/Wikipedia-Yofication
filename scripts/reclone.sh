#!/bin/sh -e
set -x

cd
rm -rf Wikipedia-Efication
sudo trash-empty
git clone git@github.com:dima74/Wikipedia-Efication.git
cd Wikipedia-Efication
git submodule update --init --recursive
cd replaces
git branch -f master b6dd96664e
git checkout master
mv ~/replaces .
mv replaces/* .
rm -r replaces
git add .
git commit -m "Замены для всех страниц Википедии"
