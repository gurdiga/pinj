JSON_FILES = secrets.json secrets.json.example
JSHINT_FILES = $(JSON_FILES) $(shell find app -name '*.js' -or -name '*.json' | sort)

jshint:
	@jshint -c makefiles/jshint/jshintrc.json $(JSHINT_FILES)
