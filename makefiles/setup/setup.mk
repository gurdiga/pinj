setup:
	@npm install && npm prune && npm outdated
	@cd app/web-ui; bower install
