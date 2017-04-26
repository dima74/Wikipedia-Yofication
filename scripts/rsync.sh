#!/bin/sh -e
cd `dirname $0`/..
rsync -r --exclude={.git,.idea,replaces} --exclude-from .gitignore --delete . 188.166.77.217:Wikipedia-Efication