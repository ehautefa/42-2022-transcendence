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

FROM 		node:current-alpine AS development
ARG 		APP_DIR=app
LABEL		maintainer="csejault"
WORKDIR 	/usr/src/app
COPY 		./data_to_container/${APP_DIR}/package*.json ./
RUN 		npm install glob rimraf
RUN 		npm install --only=development
RUN 		npm run build
COPY 		./data_to_container/${APP_DIR}/* ./

FROM 		node:current-alpine AS production
ARG 		APP_DIR=app
LABEL		maintainer="csejault"
WORKDIR 	/usr/src/app
ARG 		NODE_ENV=production
ENV 		NODE_ENV=${NODE_ENV}
COPY 		./data_to_container/${APP_DIR}/package*.json ./
RUN 		npm install --only=production
COPY 		./data_to_container/${APP_DIR}/* ./
COPY 		--from=development /usr/src/app/dist ./dist

CMD 		["node", "dist/main"]
