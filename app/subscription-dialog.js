(function() {
  'use strict';

  var INPUT_SELECTOR_PREFIX = 'input[type="radio"][name="subscription"]';

  function SubscriptionDialog(dialogDOMElement, subscription) {
    this.subscription = subscription;
    this.dialogDOMElement = dialogDOMElement;
    this.submitButton = DOM.querySelector('button.btn-primary', dialogDOMElement);

    MicroEvent.mixin(dialogDOMElement);

    this.listenForClicksOnSubmitButton();
    this.waitForTheDialogToOpen();
  }

  SubscriptionDialog.prototype.getCurrentSubscription = function() {
    return DOM.querySelector(INPUT_SELECTOR_PREFIX + ':checked', this.dialogDOMElement).value;
  };

  SubscriptionDialog.prototype.noOptionIsPicked = function() {
    return this.dialogDOMElement.querySelectorAll(INPUT_SELECTOR_PREFIX + ':checked').length === 0;
  };

  SubscriptionDialog.prototype.selectSubscription = function(subscriptionId) {
    var radioBox = this.getElementBySubscriptionId(subscriptionId);
    radioBox.checked = true;
  };

  SubscriptionDialog.prototype.waitForTheDialogToOpen = function() {
    jQuery(this.dialogDOMElement).on('shown.bs.modal', this.loadCurrentSubscription.bind(this));
  };

  SubscriptionDialog.prototype.loadCurrentSubscription = function() {
    this.subscription.get()
    .then(function(subscriptionId) {
      var radioBox = this.getElementBySubscriptionId(subscriptionId);
      radioBox.checked = true;
      this.subscription.trigger('loaded', subscriptionId);
    }.bind(this));
  };

  SubscriptionDialog.prototype.getElementBySubscriptionId = function(subscriptionId) {
    return DOM.querySelector(INPUT_SELECTOR_PREFIX + '[value="' + subscriptionId + '"]', this.dialogDOMElement);
  };

  SubscriptionDialog.prototype.listenForClicksOnSubmitButton = function() {
    this.submitButton.addEventListener('click', this.saveSubscriptionAndClose.bind(this));
  };

  SubscriptionDialog.prototype.saveSubscriptionAndClose = function() {
    var optionDOMElement = DOM.querySelector('input[name="subscription"]:checked', this.dialogDOMElement);
    var newSubscriptionId = optionDOMElement.value;

    this.subscription.set(newSubscriptionId)
    .then(this.close.bind(this))
    .then(function() {
      this.subscription.trigger('saved', newSubscriptionId);
    }.bind(this))
    .catch(function(error) {
      console.error('Error while saving subscription:', error);
    });
  };

  SubscriptionDialog.prototype.submit = function() {
    this.submitButton.click();
  };

  SubscriptionDialog.prototype.close = function() {
    var deferred = new Deferred();

    jQuery(this.dialogDOMElement)
    .on('hidden.bs.modal', function() {
      deferred.resolve();
    })
    .modal('hide');

    return deferred.promise;
  };

  SubscriptionDialog.prototype.open = function() {
    var deferred = new Deferred();

    jQuery(this.dialogDOMElement)
    .on('shown.bs.modal', function() {
      deferred.resolve();
    })
    .modal('show');

    return deferred.promise;
  };

  SubscriptionDialog.prototype.save = function() {
    this.submitButton.click();
  };

  window.SubscriptionDialog = SubscriptionDialog;

}());
