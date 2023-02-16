.DEFAULT_GOAL := help

NPM := npm
NPM_RUN := ${NPM} run
NPX := npx

DOCKER_COMPOSE := docker compose
DOCKER_COMPOSE_WITH_ENV := ${DOCKER_COMPOSE} --env-file .env.local

help: # Show this help
	@egrep -h '\s#\s' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?# "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

setup: # Install dependencies
	@${NPM} install
	@${NPX} husky install

run: # Run dev server
	@${NPM_RUN} dev

lint: # Run linters
	@${NPM_RUN} lint

build: # Build Docker image
	@${DOCKER_COMPOSE_WITH_ENV} build

start: # Run Docker container
	@${DOCKER_COMPOSE_WITH_ENV} up -d

stop: # Stop Docker container
	@${DOCKER_COMPOSE_WITH_ENV} down

restart: stop start # Build and run Docker container

.PHONY: test
test: # Run tests
	@${NPM_RUN} test
