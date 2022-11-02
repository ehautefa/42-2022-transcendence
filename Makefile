PROTOCOLE="http"
DC = docker-compose
DC_FILE = ./docker-compose_dev.yml

all: setup dev

build: setup
	$(DC) -f $(DC_FILE) up --build

dev: setup
	$(DC) -f docker-compose_dev.yml up

ps:
	$(DC) -f $(DC_FILE) ps

stop:
	$(DC) -f $(DC_FILE) down

down:
	$(DC) -f $(DC_FILE) down

re: down build

setup:
	sed -Ei "s/^PRT=.*/PRT='$(PROTOCOLE)'/" env/urls.env
	sed -Ei "s/^APP_HOST=.*/APP_HOST='$(shell hostname)'/" env/urls.env

prune: down
	docker system prune -a

deep_clean: prune
	docker volume rm -f 42-2022-transcendence_pgVolume
	rm -rf backend/data_to_container/pong/node_modules
	rm -rf backend/data_to_container/pong/dist
	rm -rf frontend/react/node_modules
	rm -rf frontend/react/dist

.PHONY = all build ps stop down re prune dev
