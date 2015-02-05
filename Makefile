default: test
pre-commit: test

x: jshint
	node 1.js

run: test
	@NODE_ENV=development node .

deps:
	npm prune && npm install && npm outdated

include $(shell find makefiles -name '*.mk' | sort)

include .env
.EXPORT_ALL_VARIABLES:
