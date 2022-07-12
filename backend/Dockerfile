# **************************************************************************** #
#                                                                              #
#                                                         :::      ::::::::    #
#    Dockerfile                                         :+:      :+:    :+:    #
#                                                     +:+ +:+         +:+      #
#    By: csejault <csejault@student.42.fr>          +#+  +:+       +#+         #
#                                                 +#+#+#+#+#+   +#+            #
#    Created: 2022/06/15 16:20:24 by csejault          #+#    #+#              #
#    Updated: 2022/06/16 14:06:25 by csejault         ###   ########.fr        #
#                                                                              #
# **************************************************************************** #

###################
# SOURCES : https://www.tomray.dev/nestjs-docker-compose-postgres
# BUILD FOR LOCAL DEVELOPMENT
###################

FROM        node:current-alpine As development

ARG 		SRC_APP_DIR=./data_to_container/pong
ARG 		DST_APP_DIR=/usr/src/app
ARG 		USER=node

# Use the node user from the image (instead of the root user)
USER        ${USER}

# Create app directory
WORKDIR     ${DST_APP_DIR}

# Copy application dependency manifests to the container image.
# A wildcard is used to ensure copying both package.json AND package-lock.json (when available).
# Copying this first prevents re-running npm install on every code change.
COPY 		${SRC_APP_DIR}/package*.json ${DST_APP_DIR}/

# Install app dependencies using the `npm ci` command instead of `npm install`
RUN         npm ci

# Bundle app source
COPY 		${SRC_APP_DIR} ${DST_APP_DIR}


###################
# BUILD FOR PRODUCTION
###################

FROM        node:current-alpine As build

ARG 		SRC_APP_DIR=./data_to_container/pong
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

ARG 		SRC_APP_DIR=./data_to_container/pong
ARG 		DST_APP_DIR=/usr/src/app
ARG 		USER=node

# Copy the bundled code from the build stage to the production image
COPY --chown=${USER}:${USER} --from=build ${DST_APP_DIR}/node_modules ${DST_APP_DIR}/node_modules
COPY --chown=${USER}:${USER} --from=build ${DST_APP_DIR}/dist ${DST_APP_DIR}/dist

# Start the server using the production build
CMD [ "node", "dist/main.js" ]



#FROM 		node:current-alpine AS development
#LABEL		maintainer="csejault"
#ARG 		APP_DIR=app
#ARG 		USER=node
#WORKDIR 	/usr/src/app
#COPY 		--chown=${USER}:${USER} ./data_to_container/${APP_DIR}/package*.json ./
#RUN 		npm ci
#COPY 		--chown=${USER}:${USER} ./data_to_container/${APP_DIR} .
#USER        ${USER}:${USER}
#
#FROM 		node:current-alpine AS production
#LABEL		maintainer="csejault"
#ARG 		APP_DIR=app
#ARG 		USER=node
#WORKDIR 	/usr/src/app
#ARG 		NODE_ENV=production
#ENV 		NODE_ENV=${NODE_ENV}
#COPY 		./data_to_container/${APP_DIR}/package*.json ./
#RUN 		npm install --only=production
#COPY 		./data_to_container/${APP_DIR} .
#COPY 		--from=development /usr/src/app/dist ./dist
#USER        ${USER}:${USER}
#
#CMD 		["node", "dist/main"]
