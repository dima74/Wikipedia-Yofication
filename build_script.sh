#!/bin/sh -e
set -x

# Википедия блокирует подсеть Travis'а...
# (так как когда-то я в нём запускал автоматическую ёфикацию в знак протеста против их отказа выдавать мне флаг автопатрулируемого)
# поэтому сборка скрипта будет выполняться на travis, а его обновление на Википедии — в начале работы web-backend

./cpp-frequencies/build_script.sh
./web-frontend/create-script-for-wikipedia.sh

# deployment
yaourt -S --noconfirm heroku-cli
heroku auth:whoami
#heroku login
heroku git:remote -a yofication
git push heroku `git subtree split --prefix web-backend master`:master --force
