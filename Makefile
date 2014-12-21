SHELL = /bin/sh
.SHELLFLAGS := -e
.ONESHELL:

-include app/.env

default: jshint test

import: jshint
	@NODE_ENV=import node .

run: jshint
	@NODE_ENV=development node .

test:
	@mocha --recursive test
.PHONY: test

deps:
	npm prune && npm install

update:
	git stash && git pull && git stash pop

include $(shell find makefiles -name '*.mk' | sort)
