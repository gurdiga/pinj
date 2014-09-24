(function() {
  'use strict';

  describe('Client List form', function() {
    var ClientListForm, Deferred, UserService, UserDataService, DOM, UserData;
    var clientListForm, form;
    var field, submitButton, saveConfirmationMessage, clientListText, userService, userDataService;

    beforeEach(function() {
      ClientListForm = this.iframe.ClientListForm;
      Deferred = this.iframe.Deferred;
      UserService = this.iframe.UserService;
      UserDataService = this.iframe.UserDataService;
      DOM = this.iframe.DOM;
      UserData = this.iframe.UserData;

      clientListText = 'the list';

      userService = sinon.createStubInstance(UserService);
      MicroEvent.mixin(userService);
      userDataService = sinon.createStubInstance(UserDataService);
      userDataService.set.returns(Deferred.createResolvedPromise());
      userDataService.get.returns(Deferred.createResolvedPromise(clientListText));

      form = prepareForm();
      field = DOM.querySelector('[name="list"]', form);
      submitButton = DOM.querySelector('[name="submit-button"]', form);
      saveConfirmationMessage = DOM.querySelector('#save-confirmation-message', form);
      document.body.appendChild(form);

      clientListForm = new ClientListForm(userService, userDataService, form);
    });

    it('displays the loaded client list into the given field', function(done) {
      clientListForm.once('loaded', function() {
        expect(userDataService.get).to.have.been.calledWith(UserData.CLIENT_LIST_PATH);
        expect(field.value).to.equal(clientListText);
        done();
      });

      userService.trigger('authenticated');
    });

    it('clears the client list on logout', function() {
      userService.trigger('deauthenticated');
      expect(field.value).to.be.empty;
    });

    it('submits the client list when button is clicked', function() {
      this.type('the entered list').into(field);
      submitButton.click();

      expect(userDataService.set).to.have.been.calledWith(UserData.CLIENT_LIST_PATH, field.value);
    });

    it('disables the submit button and shows the confirmation message', function(done) {
      clientListForm.once('saved', this.bubbleErrors(function() {
        expect(saveConfirmationMessage, 'save confirmation message').to.be.visible();
        expect(submitButton.disabled).to.be.true;
        done();
      }));

      this.type('the entered list').into(field);
      expect(submitButton.disabled).to.be.false;
      submitButton.click();
      expect(submitButton.disabled).to.be.true;
    });

    afterEach(function() {
      document.body.removeChild(form);
    });

    function prepareForm() {
      var form = document.createElement('form');

      field = document.createElement('textarea');
      field.name = 'list';
      field.value = '';

      submitButton = document.createElement('button');
      submitButton.disabled = true;
      submitButton.name = 'submit-button';

      saveConfirmationMessage = document.createElement('span');
      saveConfirmationMessage.id = 'save-confirmation-message';

      form.appendChild(field);
      form.appendChild(submitButton);
      form.appendChild(saveConfirmationMessage);

      return form;
    }
  });

}());
