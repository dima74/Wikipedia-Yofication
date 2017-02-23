#!/bin/sh -e
rsync -r --exclude .git --exclude .idea --exclude replaces --exclude-from .gitignore --delete . 188.166.77.217:Wikipedia-Efication