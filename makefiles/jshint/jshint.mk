JSHINT_FILES = cron.js $(shell find app -name '*.js' -or -name '*.json' | sort)

jshint:
	@jshint -c makefiles/jshint/jshintrc.json $(JSHINT_FILES)
