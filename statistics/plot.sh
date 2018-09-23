#!/bin/sh -e
set -x
cd `dirname $0`

rm -r frequencies
git clone --branch frequencies git@github.com:dima74/Wikipedia-Yofication.git frequencies
cd frequencies
mkdir revisions
for sha in `git rev-list HEAD -- frequencies.txt`; do
    git show ${sha}:frequencies.txt > revisions/frequencies_${sha}.txt
done

cd ..
python ./plot_words_frequencies.py