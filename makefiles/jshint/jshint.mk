jshint: makefiles/jshint/jshintrc.json

makefiles/jshint/jshintrc.json: $(JSHINT_FILES)
	@clear; jshint -c $@ $? && touch $@

jshint-force:
	@clear; jshint -c makefiles/jshint/jshintrc.json $(JSHINT_FILES)
