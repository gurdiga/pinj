SHELL = /bin/sh
.SHELLFLAGS := -e
.ONESHELL:

export
	JSHINT_FILES = input.json input.json.example $(shell find app \( -name '*.js' -or -name '*.json' \) -and \( -not -path 'app/web-ui*' \) | sort)
	JSHINT_WEB_FILES = $(shell find app/web-ui -not -path 'app/web-ui/bower_components/*' \( -name '*.js' -or -name '*.json' \) | sort)

default: test
	@node app

test: jshint
	@node app/util/storage.js
	@node app/curator.js

include $(shell find makefiles -name '*.mk' | sort)
