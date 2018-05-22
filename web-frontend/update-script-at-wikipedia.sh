#!/bin/sh -e
cd `dirname $0`

npm install
npm run build-production
pip3 install requests
python3 ./update-script-at-wikipedia.py
