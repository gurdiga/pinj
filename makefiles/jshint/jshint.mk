jshint: makefiles/jshint/jshintrc.json jshint-web-ui

makefiles/jshint/jshintrc.json: $(JSHINT_FILES)
	@clear; jshint -c $@ $? && touch $@

jshint-force:
	@clear; jshint -c makefiles/jshint/jshintrc.json $(JSHINT_FILES)

jshint-web-ui: $(JSHINT_WEB_FILES)
	@clear; jshint -c app/web-ui/jshintrc.json $? && touch app/web-ui/jshintrc.json
