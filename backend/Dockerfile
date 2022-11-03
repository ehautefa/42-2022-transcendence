FROM        node:current-alpine As development

ARG 		DST_APP_DIR=/usr/src/app
ARG 		USER=node

# Use the node user from the image (instead of the root user)
# USER        node

# Create app directory
WORKDIR     /usr/src/app

# Copy application dependency manifests to the container image.
# A wildcard is used to ensure copying both package.json AND package-lock.json (when available).
# Copying this first prevents re-running npm install on every code change.
COPY 		./data_to_container/pong/package*.json /usr/src/app/

RUN         apk update
RUN         apk add openssl
RUN         openssl req -x509 -newkey rsa:4096 -keyout /etc/ssl/private/.pong.key -out /etc/ssl/certs/pong.csr -days 365 -nodes -subj "/CN=backend"

# Install app dependencies using the `npm ci` command instead of `npm install`
RUN         npm ci

# Bundle app source
COPY 		./data_to_container/pong /usr/src/app
COPY 		./dev_entrypoint.sh /home/node


###################
# BUILD FOR PRODUCTION
###################

FROM        node:current-alpine As build

ARG 		DST_APP_DIR=/usr/src/app
ARG 		USER=node

# Create app directory
WORKDIR     /usr/src/app

COPY 		--chown=node:node ./data_to_container/pong/package*.json /usr/src/app/

# In order to run `npm run build` we need access to the Nest CLI.
# The Nest CLI is a dev dependency,
# In the previous development stage we ran `npm ci` which installed all dependencies.
# So we can copy over the node_modules directory from the development image into this build image.
COPY        --chown=node:node --from=development /usr/src/app/node_modules /usr/src/app/node_modules
COPY        --chown=node:node ./data_to_container/pong /usr/src/app


# Run the build command which creates the production bundle
RUN         npm run build

# Set NODE_ENV environment variable
ENV         NODE_ENV production

# Running `npm ci` removes the existing node_modules directory.
# Passing in --only=production ensures that only the production dependencies are installed.
# This ensures that the node_modules directory is as optimized as possible.
RUN         npm ci --omit=dev && npm cache clean --force
# RUN         chown -R node:node ./dist

USER        node

###################
# PRODUCTION
###################

FROM        node:current-alpine As production

WORKDIR     /usr/src/app
# Copy the bundled code from the build stage to the production image
COPY        --chown=node:node ./prod_entrypoint.sh /home/node/
COPY        --chown=node:node --from=build /usr/src/app/node_modules /usr/src/app/node_modules
COPY        --chown=node:node --from=build /usr/src/app/dist /usr/src/app/dist
COPY        --chown=node:node --from=development /etc/ssl/certs/pong.csr /etc/ssl/certs/
COPY        --chown=node:node --from=development /etc/ssl/private/.pong.key /etc/ssl/private/

# USER        node

# Start the server using the production build
CMD [ "node", "dist/src/main.js" ]