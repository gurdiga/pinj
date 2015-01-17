deploy: test
	@git push -f heroku

log:
	@heroku logs --tail

config:
	@heroku config:set $$(cat .env)

debug-on:
	heroku labs:enable log-runtime-metrics

debug-off:
	heroku labs:disable log-runtime-metrics

restart:
	heroku restart

start: test
	@foreman start
