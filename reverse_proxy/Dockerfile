
FROM        nginx:alpine
COPY        ./data_to_container/nginx.temp /etc/nginx/nginx.temp
COPY        ./data_to_container/entrypoint.sh /home/nginx/
RUN apk update
RUN apk add openssl