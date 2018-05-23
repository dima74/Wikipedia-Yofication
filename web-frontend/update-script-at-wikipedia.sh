#!/bin/sh -e
set -x
cd `dirname $0`

#npm install
npm run build-production
python update-script-at-wikipedia.py
