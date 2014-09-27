(function() {
  'use strict';

  describe('PaymentOverdueMessage', function() {
    var PaymentOverdueMessage, UserService, Subscription, Deferred;
    var paymentOverdueMessage, messageDOMElement, subscriptionDialogDOMElement, userService, subscription;

    beforeEach(function() {
      PaymentOverdueMessage = this.iframe.PaymentOverdueMessage;
      UserService = this.iframe.UserService;
      Subscription = this.iframe.Subscription;
      Deferred = this.iframe.Deferred;

      userService = sinon.createStubInstance(UserService);
      MicroEvent.mixin(userService);
      subscription = sinon.createStubInstance(Subscription);
      MicroEvent.mixin(subscription);

      messageDOMElement = prepareMessageDOMElement();
      document.body.appendChild(messageDOMElement);
      subscriptionDialogDOMElement = prepareSubscriptionDialog();

      paymentOverdueMessage = new PaymentOverdueMessage(messageDOMElement, subscriptionDialogDOMElement, userService, subscription);
    });

    describe('on authentication', function() {
      var subscriptionId;

      describe('when user already picked a subscription', function() {
        beforeEach(function() {
          subscriptionId = 'c30';
          subscription.get.returns(Deferred.createResolvedPromise(subscriptionId));
          userService.trigger('authenticated');
        });

        it('fetches the subscription and updates the message', function(done) {
          paymentOverdueMessage.once('updated', this.bubbleErrors(function() {
            expect(paymentOverdueMessage.getSubscriptionName()).to.equal('30 clienţi');
            expect(paymentOverdueMessage.getPaymentButton(), 'payment button').to.be.visible();
            done();
          }));
        });
      });

      describe('when a subscription is not yet selected', function() {
        beforeEach(function() {
          subscriptionId = null;
          subscription.get.returns(Deferred.createResolvedPromise(subscriptionId));
          userService.trigger('authenticated');
        });

        it('hides the payment button and shows a button to open the Subscription dialog', function(done) {
          paymentOverdueMessage.once('subscription-dialog-button-shown', this.bubbleErrors(function() {
            expect(paymentOverdueMessage.getSubscriptionDialogButton()).to.be.visible();
            expect(paymentOverdueMessage.getPaymentButton(), 'payment button').not.to.be.visible();
            done();
          }));
        });
      });

      describe('when first is not selected, and the user goes and selects one', function() {
        beforeEach(function() {
          subscription.get.returns(Deferred.createResolvedPromise(null));
          userService.trigger('authenticated');
        });

        it('hides the button to open the subscription dialog, and shows the payment button', function(done) {
          paymentOverdueMessage.once('updated', this.bubbleErrors(function() {
            expect(paymentOverdueMessage.getSubscriptionName()).to.equal('60 clienţi');
            expect(paymentOverdueMessage.getSubscriptionDialogButton(), 'button to the subscription dialog').not.to.be.visible();
            expect(paymentOverdueMessage.getPaymentButton(), 'payment button').to.be.visible();
            done();
          }));

          paymentOverdueMessage.once('subscription-dialog-button-shown', this.bubbleErrors(function() {
            subscription.trigger('changed', 'c60');
          }));
        });
      });
    });

    describe('when subscription is changed', function() {
      var subscriptionId = 'c15';

      it('updates the message', function(done) {
        paymentOverdueMessage.once('updated', this.bubbleErrors(function() {
          expect(paymentOverdueMessage.getSubscriptionName()).to.equal('15 clienţi');
          expect(paymentOverdueMessage.getPaymentButton(), 'payment button').to.be.visible();
          done();
        }));
        subscription.trigger('changed', subscriptionId);
      });
    });

    afterEach(function() {
      document.body.removeChild(messageDOMElement);
    });

    function prepareMessageDOMElement() {
      var messageDOMElement = document.createElement('div');

      messageDOMElement.innerHTML =
        '<button id="' + PaymentOverdueMessage.PAYMENT_BUTTON_DOM_ID + '">payment button</button>' +
        '<span id="' + PaymentOverdueMessage.SUBSCRIPTION_NAME_DOM_ID + '">here will go the subscription name</span>' +
        '<button style="display:none" ' +
          'id="' + PaymentOverdueMessage.SUBSCRIPTION_DIALOG_BUTTON_DOM_ID + '">button to open the subscription dialog</a>'
      ;

      return messageDOMElement;
    }

    function prepareSubscriptionDialog() {
      var dialog = document.createElement('div');

      dialog.innerHTML =
        '<label><input type="radio" name="subscription" value="c15"/>15 clienţi</label>' +
        '<label><input type="radio" name="subscription" value="c30"/>30 clienţi</label>' +
        '<label><input type="radio" name="subscription" value="c60"/>60 clienţi</label>'
      ;

      return dialog;
    }
  });

}());
