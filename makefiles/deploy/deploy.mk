deploy:
	ssh -p59922 pinj@pinj.pentru.md 'cd src/pinj; git pull origin $(BRANCH)'
