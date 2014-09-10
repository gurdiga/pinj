(function() {
  'use strict';

  describe('querySelector', function() {
    var querySelector, returnValue;

    beforeEach(function() {
      querySelector = this.iframe.querySelector;
    });

    it('delegates to document.querySelector', function() {
      returnValue = {'the': 'dom object'};
      this.sinon.stub(this.iframe.document, 'querySelector').returns(returnValue);

      expect(querySelector('#selector'), 'return value').to.equal(returnValue);
      expect(this.iframe.document.querySelector).to.have.been.calledWith('#selector');
    });

    it('accepts a context element as the second argument', function() {
      var context = document.createElement('div');
      var child = document.createElement('span');
      context.appendChild(child);

      expect(querySelector('span', context)).to.equal(child);
    });

    it('throws when the element is not found', function() {
      expect(function() {
        querySelector('slajnakjnkj');
      }).to.throw(/Element not found by selector.*slajnakjnkj.*/);
    });
  });

}());
