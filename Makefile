SHELL = /bin/sh
.SHELLFLAGS := -e
.ONESHELL:

export
	JSHINT_FILES = input.json $(shell find app -name '*.js' -or -name '*.json' | sort)

default: test
	@node app

test: jshint
	@node app/util/storage.js
	@node app/curator.js

include $(shell find makefiles -name '*.mk' | sort)
