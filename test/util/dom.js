(function() {
  'use strict';

  describe('DOM', function() {
    var DOM;

    beforeEach(function() {
      DOM = this.iframe.DOM;
    });

    describe('querySelector', function() {
      var querySelector, returnValue;

      beforeEach(function() {
        querySelector = DOM.querySelector;
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

    describe('querySelectorAll', function() {
      var querySelectorAll, returnValue;

      beforeEach(function() {
        querySelectorAll = DOM.querySelectorAll;
      });

      it('delegates to document.querySelectorAll', function() {
        returnValue = ['a list of nodes'];
        this.sinon.stub(this.iframe.document, 'querySelectorAll').returns(returnValue);

        expect(querySelectorAll('div'), 'return value').to.deep.equal(returnValue);
        expect(this.iframe.document.querySelectorAll).to.have.been.calledWith('div');
      });

      it('accepts a context element as the second argument', function() {
        var context = document.createElement('div');
        context.appendChild(document.createElement('span'));
        context.appendChild(document.createElement('span'));
        context.appendChild(document.createElement('span'));

        returnValue = querySelectorAll('span', context);
        expect(returnValue).to.be.an('array');
        expect(returnValue.length).to.equal(3);
      });

      it('throws when no element is found', function() {
        expect(function() {
          querySelectorAll('slajnakjnkj');
        }).to.throw(/Elements not found by selector.*slajnakjnkj.*/);
      });
    });
  });

}());
