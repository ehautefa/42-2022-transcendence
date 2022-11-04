
###################
# SOURCES : https://www.tomray.dev/nestjs-docker-compose-postgres
# BUILD FOR LOCAL DEVELOPMENT
###################

FROM        node:current-alpine As development

# Create app directory
WORKDIR     /usr/src/app

COPY 		--chown=node:node ./react/package*.json /usr/src/app/

RUN         apk update && \
            apk add openssl && \
            openssl req -x509 -newkey rsa:4096 -keyout /etc/ssl/private/.pong.key -out /etc/ssl/certs/pong.csr -days 365 -nodes -subj "/CN=frontend" && \
            npm install -g npm@latest


# Install app dependencies using the `npm ci` command instead of `npm install`
RUN         npm install

# Bundle app source
COPY 		./react /usr/src/app
COPY 		./scripts/dev_entrypoint.sh /home/node/

###################
# BUILD FOR PRODUCTION
###################

FROM        node:current-alpine As build

# Create app directory
WORKDIR     /usr/src/app

COPY 		--chown=node:node ./react/package*.json /usr/src/app/

# In order to run `npm run build` we need access to the Nest CLI.
# The Nest CLI is a dev dependency,
# In the previous development stage we ran `npm ci` which installed all dependencies.
# So we can copy over the node_modules directory from the development image into this build image.
# RUN         npm ci --only=production && npm cache clean --force

# ENV         NODE_ENV production
RUN         npm install

COPY 		--chown=node:node ./react /usr/src/app
# Run the build command which creates the production bundle
RUN         npm run build

# Set NODE_ENV environment variable
RUN         npm ci --omit=dev && npm cache clean --force

# Running `npm ci` removes the existing node_modules directory.
# Passing in --only=production ensures that only the production dependencies are installed.
# This ensures that the node_modules directory is as optimized as possible.

USER        node

###################
# PRODUCTION
###################

FROM        nginx:alpine As production

WORKDIR     /var/www/html
# Remove default nginx static resources
RUN         rm -rf ./*
# Copies static resources from builder stage
COPY        --chown=nginx:nginx ./pong.nginx.temp /etc/nginx/conf.d/
COPY        --chown=nginx:nginx ./scripts/prod_entrypoint.sh /home/nginx/
COPY        --chown=nginx:nginx --from=build /usr/src/app/build ./pong
COPY        --chown=nginx:nginx --from=development /etc/ssl/certs/pong.csr /etc/ssl/certs/
COPY        --chown=nginx:nginx --from=development /etc/ssl/private/.pong.key /etc/ssl/private/
# Containers run nginx with global directives and daemon off
CMD ["nginx", "-g", "daemon off;"]

