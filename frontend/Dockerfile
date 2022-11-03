
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
RUN npm install
COPY 		${SRC_APP_DIR} ${DST_APP_DIR}
# Run the build command which creates the production bundle
COPY    ./.env .
RUN         npm run build

# Set NODE_ENV environment variable

# Running `npm ci` removes the existing node_modules directory.
# Passing in --only=production ensures that only the production dependencies are installed.
# This ensures that the node_modules directory is as optimized as possible.

USER        ${USER}

###################
# PRODUCTION
###################

FROM        nginx As production

ARG 		SRC_APP_DIR=./data_to_container
ARG 		DST_APP_DIR=/usr/src/app
ARG 		USER=node

WORKDIR /var/www/html
# Remove default nginx static resources
RUN rm -rf ./*
# Copies static resources from builder stage
COPY    ./pong.nginx.temp /etc/nginx/conf.d/
COPY    --chown=nginx:nginx ./scripts/prod_entrypoint.sh /home/nginx/
COPY    --chown=nginx:nginx --from=build ${DST_APP_DIR}/build ./pong
# Containers run nginx with global directives and daemon off
CMD ["nginx", "-g", "daemon off;"]

