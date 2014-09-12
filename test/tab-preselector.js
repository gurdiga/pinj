(function() {
  'use strict';

  describe('TabPreselector', function() {
    var TabPreselector;
    var tabPreselector, tabjQueryObject;

    beforeEach(function() {
      TabPreselector = this.iframe.TabPreselector;

      tabjQueryObject = [document.createElement('a')];
      tabjQueryObject.tab = this.sinon.spy();
      this.sinon.stub(this.iframe, 'jQuery').returns(tabjQueryObject);
    });

    describe('when the is a tab ID', function() {
      beforeEach(function() {
        tabPreselector = new TabPreselector('#tab-id');
      });

      it('activates the corrensponding tab', function() {
        expect(tabjQueryObject.tab).to.have.been.calledWith('show');
      });
    });
  });

}());
