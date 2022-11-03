
FROM        nginx:alpine
ARG         USER=nginx

RUN         apk update
RUN         apk add openssl
COPY        --chown=${USER}:${USER} ./data_to_container/nginx.temp /etc/nginx/nginx.temp
COPY        --chown=${USER}:${USER} ./data_to_container/entrypoint.sh /home/nginx/