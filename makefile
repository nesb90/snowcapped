setup:
	docker volume create --name=snowcapped-db
	cp -n .env.example .env

build:
	docker build .

install:
	docker-compose -f docker-compose.yaml -f docker/docker-compose.install.yaml up snowcapped

init-db:
	docker-compose run --rm snowcapped run init:db

db-migrate:
	docker-compose run --rm snowcapped run db:migrate

db-migrate-revert:
	docker-compose run --rm snowcapped run db:migrate:revert

dev:
	docker-compose -f docker-compose.yaml -f docker/docker-compose.dev.yaml up snowcapped

debug:
	docker-compose -f docker-compose.yaml -f docker/docker-compose.debug.yaml up snowcapped

down:
	docker-compose down --remove-orphans
