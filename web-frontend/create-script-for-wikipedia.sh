#!/bin/sh -e
set -x
cd `dirname $0`

npm install
npm run build-production

cp ./dist/yoficator.bundle.min.js update-script-at-wikipedia.py ../web-backend
git add ../web-backend
git -c user.name='Example Name' -c user.email='example@yandex.ru' commit -m "Add wikipedia user script file"
