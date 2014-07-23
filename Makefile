SHELL = /bin/sh
.SHELLFLAGS := -e
.ONESHELL:

default: jshint
	@node app

export
	JSHINT_FILES = input.json $(shell find app -name '*.js' -or -name '*.json' | sort)

include $(shell find makefiles -name '*.mk' | sort)
