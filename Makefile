SHELL = /bin/sh
.SHELLFLAGS := -e
.ONESHELL:

default: jshint test

test:
	@clear; node app/index.js

export
	JSHINT_FILES = input.json $(shell find app -name '*.js' -or -name '*.json' | sort)

include $(shell find makefiles -name '*.mk' | sort)
