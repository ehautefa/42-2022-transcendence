apk add openssl
openssl req -x509 -newkey rsa:4096 -keyout /etc/ssl/.pong.key -out /etc/ssl/pong.csr -days 365 -nodes -subj "/CN=$APP_HOST"
npm ci
npm run start