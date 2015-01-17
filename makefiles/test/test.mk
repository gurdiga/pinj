.PHONY: test
test: jshint
	@NODE_ENV=test mocha \
		--reporter dot \
		--bail \
		--check-leaks \
		--inline-diffs \
		--recursive test/helper test
