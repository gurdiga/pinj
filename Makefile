default: test

pre-commit: test

x:
	node 1.js

run: test
	@NODE_ENV=development node .

.PHONY: test
test: jshint
	@NODE_ENV=test mocha \
		--reporter dot \
		--bail \
		--check-leaks \
		--inline-diffs \
		--recursive test/helper test

deploy:
	@git push -f heroku

deps:
	npm prune && npm install

log:
	@heroku logs --tail

start: jshint
	@foreman start

config:
	@heroku config:set $$(cat .env)

debug-on:
	heroku labs:enable log-runtime-metrics

debug-off:
	heroku labs:disable log-runtime-metrics

restart:
	heroku restart

include $(shell find makefiles -name '*.mk' | sort)

include .env
.EXPORT_ALL_VARIABLES:
