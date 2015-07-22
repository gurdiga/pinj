default: test
pre-commit: prevent-only test

x:
	node 1.js

run: test
	@NODE_ENV=development node run app/index

deps:
	npm prune && npm install

prevent-only:
	@grep -n -R -F '.only(' test; \
	if [ "$$?" == "0" ]; then \
		echo '\n-- Please remove only() from tests --\n'; \
		RESULT=1; \
	else \
		RESULT=0; \
	fi && \
	exit $$RESULT

JS_FILES = $(shell find test app -name '*.js' -or -name '*.json' | sort)

include $(shell find makefiles -name '*.mk' | sort)

include .env
.EXPORT_ALL_VARIABLES:
