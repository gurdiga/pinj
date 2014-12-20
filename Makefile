SHELL = /bin/sh
.SHELLFLAGS := -e
.ONESHELL:

default: jshint test

run: jshint
	@NODE_ENV=development node app

test:
	@mocha --recursive test
.PHONY: test

deps:
	npm prune && npm install

update:
	git stash && git pull && git stash pop

include $(shell find makefiles -name '*.mk' | sort)
