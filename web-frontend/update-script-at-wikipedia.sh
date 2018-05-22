#!/bin/sh -e
cd `dirname $0`

npm install
npm run build-production
sudo pip install requests
python ./update-script-at-wikipedia.py
