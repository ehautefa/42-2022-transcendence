#!/bin/sh

openssl req -x509 -newkey rsa:4096 -keyout /etc/ssl/private/.pong.key -out /etc/ssl/certs/pong.csr -days 365 -nodes -subj "/CN=$APP_HOST"

envsubst '$${APP_HOST} $${REACT_APP_RP_BACK_URL} $${REACT_APP_RP_FRONT_URL} '< /etc/nginx/nginx.temp > /etc/nginx/nginx.conf
exec nginx -g 'daemon off;'