# HTTPS=1
DC = docker-compose
DC_FILE = ./docker-compose.yml

all: setup prod

build: setup
	$(DC) -f $(DC_FILE) up --build

prod: setup
	$(DC) -f $(DC_FILE) up

dev: setup
	$(DC) -f docker-compose_dev.yml up

dev_build: setup
	$(DC) -f docker-compose_dev.yml up --build

ps:
	$(DC) -f $(DC_FILE) ps

stop:
	$(DC) -f $(DC_FILE) down

down:
	$(DC) -f $(DC_FILE) down

re: down build

setup:
	sed -Ei "s/^APP_HOST=.*/APP_HOST='$(shell hostname)'/" .env
# @if [ "$(HTTPS)" = 1 ]; then \
	# sed -Ei "s/^PRT=.*/PRT='https'/" env/urls.env ; \
		# sed -Ei "s/listen 443.*/listen 443 ssl;/" reverse_proxy/data_to_container/nginx.temp ; \
	# else\
		# sed -Ei "s/^PRT=.*/PRT='http'/" env/urls.env ; \
		# sed -Ei "s/listen 443.*/listen 443;/" reverse_proxy/datas_to_container/nginx.temp ; \
	# fi

prune: down
	docker system prune -a

deep_clean: prune
	docker volume rm -f 42-2022-transcendence_pgVolume
	rm -rf backend/data_to_container/pong/node_modules
	rm -rf backend/data_to_container/pong/dist
	rm -rf frontend/react/node_modules
	rm -rf frontend/react/dist

.PHONY = all build ps stop down re prune dev
