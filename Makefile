default: test
pre-commit: test

x:
	node 1.js

run: test
	@NODE_ENV=development node .

deps:
	npm prune && npm install

JS_FILES = $(shell find test app -name '*.js' -or -name '*.json' | sort)

include $(shell find makefiles -name '*.mk' | sort)

include .env
.EXPORT_ALL_VARIABLES:
