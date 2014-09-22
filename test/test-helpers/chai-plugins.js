(function() {
  'use strict';

  chai.use(function (_chai, utils) {
    chai.Assertion.addMethod('visible', function() {
      var element = utils.flag(this, 'object');

      this.assert(
        // thanks to jQuery source
        !!element && (element.offsetWidth > 0 || element.offsetHeight > 0),
        'expected ' + element + ' to be visible',
        'expected ' + element + ' not to be visible'
      );
    });

    chai.Assertion.addMethod('focused', function() {
      var element = utils.flag(this, 'object');

      this.assert(
        element === element.ownerDocument.activeElement,
        'expected ' + element + ' to be focused',
        'expected ' + element + ' not to be focused'
      );
    });

    chai.Assertion.addMethod('containElement', function(childSelector) {
      var element = utils.flag(this, 'object');
      var description = utils.flag(this, 'message');

      if (description) description = '';
      else description = ' ' + element;

      this.assert(
        element.querySelector(childSelector) !== null,
        'expected' + description + ' to contain element ' + childSelector,
        'expected' + description + ' not to contain element ' + childSelector
      );
    });

    chai.Assertion.addMethod('containElements', function(childSelectors) {
      var element = utils.flag(this, 'object');
      var description = utils.flag(this, 'message');

      childSelectors.forEach(function(childSelector) {
        expect(element, description).to.containElement(childSelector);
      });
    });
  });

}());
