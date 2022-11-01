DC = docker-compose
DC_FILE = ./docker-compose_dev.yml

all: dev

build:
	$(DC) -f $(DC_FILE) up --build

dev:
	$(DC) -f docker-compose_dev.yml up

ps:
	$(DC) -f $(DC_FILE) ps

stop:
	$(DC) -f $(DC_FILE) down

down:
	$(DC) -f $(DC_FILE) down

re: down build

prune: down
	docker system prune -a

deep_clean: prune
	docker volume rm -f 42-2022-transcendence_pgVolume
	rm -rvf backend/data_to_container/pong/node_modules
	rm -rvf backend/data_to_container/pong/dist
	rm -rvf frontend/react/node_modules
	rm -rvf frontend/react/dist

.PHONY = all build ps stop down re prune dev
