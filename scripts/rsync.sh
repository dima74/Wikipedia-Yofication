#!/bin/zsh -e
rsync -r --exclude .git --exclude .idea --exclude-from .gitignore --delete . 188.166.77.217:wikipedia