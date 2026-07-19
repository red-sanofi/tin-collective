SHELL := /bin/sh

COMPOSE ?= docker compose
COMPOSE_FILE ?= docker-compose.yml
PROD_COMPOSE_FILE ?= docker-compose.prod.yml
ENV_FILE ?= .env
ENV_EXAMPLE ?= .env.example

.PHONY: help setup check build up start run down logs ps clean prod prod-down restart

help:
	@echo "Tin Kolektif - common commands"
	@echo ""
	@echo "  make start     Setup + build + run (recommended for first run)"
	@echo "  make build     Same as start (beginner-friendly alias)"
	@echo "  make up        Start existing containers"
	@echo "  make down      Stop containers"
	@echo "  make logs      Follow service logs"
	@echo "  make ps        Show container status"
	@echo "  make clean     Stop containers and remove volumes"
	@echo "  make prod      Run production-like stack on http://localhost:8080"
	@echo "  make check     Verify Docker is installed and running"
	@echo ""
	@echo "One-liner after clone:"
	@echo "  git clone https://github.com/red-sanofi/tin-collective.git && cd tin-collective && make build"

setup:
	@./scripts/setup.sh setup

check:
	@./scripts/setup.sh check

build: setup
	@./scripts/setup.sh build

up:
	@./scripts/setup.sh up

start: build

run: start

down:
	@./scripts/setup.sh down

logs:
	@./scripts/setup.sh logs

ps:
	@$(COMPOSE) -f $(COMPOSE_FILE) ps

clean:
	@./scripts/setup.sh clean

prod: setup
	@./scripts/setup.sh prod

prod-down:
	@$(COMPOSE) -f $(PROD_COMPOSE_FILE) down

restart: down start
