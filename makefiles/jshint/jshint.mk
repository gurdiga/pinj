JSHINT_FILES = $(shell ls -1 *.js) $(shell find test app -name '*.js' -or -name '*.json' | sort)

jshint:
	@jshint -c makefiles/jshint/jshintrc.json $(JSHINT_FILES)
