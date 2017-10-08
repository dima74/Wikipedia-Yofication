#!/bin/sh -e
cp /home/dima/Wikipedia-Yofication/web-backend/gunicorn-wikipedia-yofication.service /etc/systemd/system/
systemctl daemon-reload
systemctl reload gunicorn-wikipedia-yofication.service
nginx -s reload