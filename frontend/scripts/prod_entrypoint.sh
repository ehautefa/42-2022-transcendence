#!/bin/sh
envsubst '$${APP_HOST}'< /etc/nginx/conf.d/pong.nginx.temp > /etc/nginx/conf.d/default.conf
exec nginx -g 'daemon off;'