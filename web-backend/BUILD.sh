#!/bin/sh -e
set -x

# cd && git clone git@github.com:dima74/Wikipedia-Yofication.git
mkdir -p /home/dima/logs

sudo -s <<EOF
pacman -S --needed gunicorn python-gevent python-flask python-raven cmake

# files from wikipedia dump
/home/dima/Wikipedia-Yofication/cpp-frequencies/scripts/all.sh

# nginx
ln -s /home/dima/Wikipedia-Yofication/web-backend/gunicorn-wikipedia-yofication.service /etc/systemd/system/
systemctl enable gunicorn-wikipedia-yofication.service
systemctl start gunicorn-wikipedia-yofication.service

ln -s /home/dima/Wikipedia-Yofication/nginx/remote /etc/nginx/yofication
ln -s /etc/nginx/yofication/server-without-ssl.conf /etc/nginx/sites-enabled/yofication.conf
nginx -s reload
certbot certonly --nginx --email diraria+ssl@yandex.ru -d yofication.diraria.ru

ln -sf /etc/nginx/yofication/server.conf /etc/nginx/sites-enabled/yofication.conf
nginx -s reload