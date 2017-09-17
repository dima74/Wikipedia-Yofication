#!/bin/sh -e
cp /home/dima/Wikipedia-Yofication/web/gunicorn-wikipedia-efication.service /etc/systemd/system/
systemctl daemon-reload
systemctl reload gunicorn-wikipedia-efication.service
nginx -s reload