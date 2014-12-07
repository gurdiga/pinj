SHELL = /bin/sh
.SHELLFLAGS := -e
.ONESHELL:

export
	JSON_FILES = secrets.json secrets.json.example
	JSHINT_FILES = $(JSON_FILES) $(shell find app -name '*.js' -or -name '*.json' | sort)

default: test
	@NODE_ENV=development node app

test: jshint
	@node app/util/storage.js
	@node app/curator.js

update:
	git stash && git pull && git stash pop

include $(shell find makefiles -name '*.mk' | sort)
