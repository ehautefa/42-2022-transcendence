DC = docker-compose
DC_FILE = ./docker-compose.yml

all: build

build:
	$(DC) -f $(DC_FILE) up --build

ps:
	$(DC) -f $(DC_FILE) ps

stop:
	$(DC) -f $(DC_FILE) down

down:
	$(DC) -f $(DC_FILE) down --volume

re: down build

prune: down
	docker system prune -a

.PHONY = all build ps stop down re prune
