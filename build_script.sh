#!/bin/sh -e

./cpp-frequencies/build_script.sh
./web-frontend/update-script-at-wikipedia.sh

# deployment
yaourt -S heroku-cli
heroku git:remote -a yofication
git push heroku `git subtree split --prefix web-backend master`:master --force
