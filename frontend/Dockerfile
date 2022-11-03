
###################
# SOURCES : https://www.tomray.dev/nestjs-docker-compose-postgres
# BUILD FOR LOCAL DEVELOPMENT
###################

FROM        node:current-alpine As development

ARG 		SRC_APP_DIR=./react
ARG 		DST_APP_DIR=/usr/src/app
ARG 		USER=node

# Use the node user from the image (instead of the root user)
# USER        ${USER}

# Create app directory
WORKDIR     ${DST_APP_DIR}

# Copy application dependency manifests to the container image.
# A wildcard is used to ensure copying both package.json AND package-lock.json (when available).
# Copying this first prevents re-running npm install on every code change.

COPY 		${SRC_APP_DIR}/package*.json ${DST_APP_DIR}/

RUN         apk update
RUN         apk add openssl
RUN         openssl req -x509 -newkey rsa:4096 -keyout /etc/ssl/private/.pong.key -out /etc/ssl/certs/pong.csr -days 365 -nodes -subj "/CN=frontend"

# Install app dependencies using the `npm ci` command instead of `npm install`
RUN         npm ci

# Bundle app source
COPY 		${SRC_APP_DIR} ${DST_APP_DIR}
# COPY 		./scripts/dev_entrypoint.sh /home/node/scripts/
COPY 		./scripts/dev_entrypoint.sh /home/node/

###################
# BUILD FOR PRODUCTION
###################

FROM        node:current-alpine As build

ARG 		SRC_APP_DIR=./react
ARG 		DST_APP_DIR=/usr/src/app
ARG 		USER=node

# Create app directory
WORKDIR     ${DST_APP_DIR}

COPY 		--chown=${USER}:${USER} ${SRC_APP_DIR}/package*.json ${DST_APP_DIR}/

# In order to run `npm run build` we need access to the Nest CLI.
# The Nest CLI is a dev dependency,
# In the previous development stage we ran `npm ci` which installed all dependencies.
# So we can copy over the node_modules directory from the development image into this build image.
# RUN         npm ci --only=production && npm cache clean --force

# ENV         NODE_ENV production
RUN         npm install
COPY 		${SRC_APP_DIR} ${DST_APP_DIR}
# Run the build command which creates the production bundle
RUN         npm run build

# Set NODE_ENV environment variable

# Running `npm ci` removes the existing node_modules directory.
# Passing in --only=production ensures that only the production dependencies are installed.
# This ensures that the node_modules directory is as optimized as possible.

USER        ${USER}

###################
# PRODUCTION
###################

FROM        nginx:alpine As production

ARG 		SRC_APP_DIR=./data_to_container
ARG 		DST_APP_DIR=/usr/src/app
ARG 		USER=nginx

WORKDIR     /var/www/html
# Remove default nginx static resources
RUN         rm -rf ./*
# Copies static resources from builder stage
COPY        --chown=${USER}:${USER} ./pong.nginx.temp /etc/nginx/conf.d/
COPY        --chown=${USER}:${USER} ./scripts/prod_entrypoint.sh /home/nginx/
COPY        --chown=${USER}:${USER} --from=build ${DST_APP_DIR}/build ./pong
COPY        --chown=${USER}:${USER} --from=development /etc/ssl/certs/pong.csr /etc/ssl/certs/
COPY        --chown=${USER}:${USER} --from=development /etc/ssl/private/.pong.key /etc/ssl/private/
# Containers run nginx with global directives and daemon off
CMD ["nginx", "-g", "daemon off;"]

