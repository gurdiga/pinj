deploy: quick-deploy
	ssh -p59922 pinj@files.pentru.md 'cd src/pinj; make setup'

quick-deploy:
	ssh -p59922 pinj@files.pentru.md 'cd src/pinj; git checkout .; git pull origin $(BRANCH)'
