###################
# SOURCES : https://www.tomray.dev/nestjs-docker-compose-postgres
# BUILD FOR LOCAL DEVELOPMENT
###################

FROM        node:current-alpine As development

ARG 		SRC_APP_DIR=./data_to_container
ARG 		DST_APP_DIR=/usr/src/app
ARG 		USER=node

ENV		PORT 3000

# Create app directory
WORKDIR     ${DST_APP_DIR}

# Copy application dependency manifests to the container image.
# A wildcard is used to ensure copying both package.json AND package-lock.json (when available).
# Copying this first prevents re-running npm install on every code change.

COPY 		--chown=${USER}:${USER} ${SRC_APP_DIR}/package*.json ${DST_APP_DIR}/

# Install app dependencies using the `npm ci` command instead of `npm install`
RUN         npm ci

# Bundle app source
COPY 		--chown=${USER}:${USER} ${SRC_APP_DIR} ${DST_APP_DIR}


# Use the node user from the image (instead of the root user)
USER        ${USER}

###################
# BUILD FOR PRODUCTION
###################

FROM        node:current-alpine As build

ARG 		SRC_APP_DIR=./data_to_container
ARG 		DST_APP_DIR=/usr/src/app
ARG 		USER=node

# Create app directory
WORKDIR     ${DST_APP_DIR}

COPY 		--chown=${USER}:${USER} ${SRC_APP_DIR}/package*.json ${DST_APP_DIR}/

# In order to run `npm run build` we need access to the Nest CLI.
# The Nest CLI is a dev dependency,
# In the previous development stage we ran `npm ci` which installed all dependencies.
# So we can copy over the node_modules directory from the development image into this build image.
COPY        --chown=${USER}:${USER} --from=development ${DST_APP_DIR}/node_modules ${DST_APP_DIR}/node_modules

COPY        --chown=node:node ${SRC_APP_DIR} ${DST_APP_DIR}

# Run the build command which creates the production bundle
RUN         npm run build

# Set NODE_ENV environment variable
ENV         NODE_ENV production

# Running `npm ci` removes the existing node_modules directory.
# Passing in --only=production ensures that only the production dependencies are installed.
# This ensures that the node_modules directory is as optimized as possible.
RUN         npm ci --only=production && npm cache clean --force

USER        ${USER}

###################
# PRODUCTION
###################

FROM        node:current-alpine As production

ARG 		SRC_APP_DIR=./data_to_container
ARG 		DST_APP_DIR=/usr/src/app
ARG 		USER=node

# Copy the bundled code from the build stage to the production image
COPY --chown=${USER}:${USER} --from=build ${DST_APP_DIR}/node_modules ${DST_APP_DIR}/node_modules
COPY --chown=${USER}:${USER} --from=build ${DST_APP_DIR}/dist ${DST_APP_DIR}/dist

# Start the server using the production build
CMD [ "node", "dist/main.js" ]

