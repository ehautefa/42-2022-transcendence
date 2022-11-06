
FROM        nginx:alpine

RUN         apk update && \
            apk add openssl
COPY        --chown=nginx:nginx ./data_to_container/nginx.temp /etc/nginx/nginx.temp
COPY        --chown=nginx:nginx ./data_to_container/entrypoint.sh /home/nginx/