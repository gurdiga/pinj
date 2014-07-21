deploy:
	ssh -p59922 pinj@pinj.pentru.md 'cd src/pinj; git checkout .; git pull origin $(BRANCH); make setup'
