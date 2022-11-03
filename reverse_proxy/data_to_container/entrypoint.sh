#!/bin/sh

envsubst '$${APP_HOST} $${REACT_APP_RP_BACK_URL} $${REACT_APP_RP_FRONT_URL} '< /etc/nginx/nginx.temp > /etc/nginx/nginx.conf
exec nginx -g 'daemon off;'