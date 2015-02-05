deploy: test
	git push -f heroku

log:
	heroku logs --tail

config:
	@heroku config:set $(shell \
		grep -v '^\s*$$' .env | \
		while IFS== read name value; do \
			echo $$name="'$$value'"; \
		done \
	)

debug-on:
	heroku labs:enable log-runtime-metrics

debug-off:
	heroku labs:disable log-runtime-metrics

restart:
	heroku restart

start: test
	foreman start
