#!/bin/zsh -e
rsync -r --exclude .git --exclude-from .gitignore . 188.166.77.217:wikipedia