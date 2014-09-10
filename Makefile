SHELL = /bin/sh
.SHELLFLAGS := -e
.ONESHELL:

export
	JSON_FILES = payers.json payers.json.example secrets.json secrets.json.example
	JSHINT_FILES = $(JSON_FILES) $(shell find app -name '*.js' -or -name '*.json' | sort)

default: test
	@node app

test: jshint
	@node app/util/storage.js
	@node app/curator.js

include $(shell find makefiles -name '*.mk' | sort)
