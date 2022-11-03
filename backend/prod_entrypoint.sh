#!/bin/sh
apk add openssl
if [ ! -f "/ect/ssl/pong/.pong.key" ]; then
    openssl req -x509 -newkey rsa:4096 -keyout /etc/ssl/pong/.pong.key -out /etc/ssl/pong/pong.csr -days 365 -nodes -subj "/CN=$APP_HOST"
fi

node ./dist/src/main.js