#!/bin/zsh -e
set -x

DIR="$(dirname $0)/../../temp/github-cache"
mkdir -p ${DIR}
cd ${DIR}

mkdir -p dictionary frequencies
for file in "not_safe.txt" "safe.txt"; do
	curl --compressed -L "https://github.com/e2yo/eyo-kernel/raw/master/dictionary/${file}" >"dictionary/${file}"
done
for file in "frequencies.txt" "all-pages.txt" "pages-for-words-with-few-replaces.json"; do
	curl --compressed -L "https://github.com/dima74/Wikipedia-Yofication/raw/frequencies/${file}" >"frequencies/${file}"
done
