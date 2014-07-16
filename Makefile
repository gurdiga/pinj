SHELL = /bin/sh
.SHELLFLAGS := -e
.ONESHELL:

default: jshint test

test:
	#clear; node app/index.js "Romanescu Constantin" "Cebanu Valentina"
	@clear; node app/index.js "Romanescu Constantin"

export
	JSHINT_FILES = $(shell find app -name '*.js' -or -name '*.json' | sort)

include $(shell find makefiles -name '*.mk' | sort)
