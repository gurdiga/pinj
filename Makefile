default: jshint test

x:
	node 1.js

import: jshint
	@NODE_ENV=import node .

run: jshint
	@NODE_ENV=development node .

test: jshint
	@mocha --recursive test
.PHONY: test

deploy:
	@git push -f heroku

deps:
	npm prune && npm install

log:
	@heroku logs --tail

start: jshint
	@foreman start

config:
	@heroku config:set $$(cat .env)

include $(shell find makefiles -name '*.mk' | sort)

include .env
.EXPORT_ALL_VARIABLES:
