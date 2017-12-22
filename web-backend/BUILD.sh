#!/bin/sh -e
set -x

# cd && git clone git@github.com:dima74/Wikipedia-Yofication.git && ./Wikipedia-Yofication/web-backend/BUILD.sh
mkdir -p /home/dima/logs

sudo pacman -S --needed gunicorn python-gevent python-flask python-raven cmake

# files from wikipedia dump
/home/dima/Wikipedia-Yofication/cpp-frequencies/scripts/all.sh

# nginx
sudo ln -s /home/dima/Wikipedia-Yofication/web-backend/gunicorn-wikipedia-yofication.service /etc/systemd/system/
sudo systemctl enable gunicorn-wikipedia-yofication.service
sudo systemctl start gunicorn-wikipedia-yofication.service

sudo ln -s /home/dima/Wikipedia-Yofication/nginx/remote /etc/nginx/yofication
sudo ln -s /etc/nginx/yofication/server-without-ssl.conf /etc/nginx/sites-enabled/yofication.conf
sudo nginx -s reload
sudo certbot certonly --nginx --email diraria+ssl@yandex.ru -d yofication.diraria.ru

sudo ln -sf /etc/nginx/yofication/server.conf /etc/nginx/sites-enabled/yofication.conf
sudo nginx -s reload