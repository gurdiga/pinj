SHELL = /bin/sh
.SHELLFLAGS := -e
.ONESHELL:

export
	JSHINT_FILES = bower.json $(shell find app test -not -path 'bower_components/*' \( -name '*.js' -or -name '*.json' \) | sort)

default: jshint
pre-commit: default

include $(shell find makefiles -name '*.mk' | sort)
