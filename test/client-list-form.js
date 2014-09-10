(function() {
  'use strict';

  describe('Client List form', function() {
    var ClientListService, ClientListForm, Deferred;
    var clientListForm, clientListService, field, submitButton, saveConfirmationMessage;

    beforeEach(function(done) {
      ClientListService = this.iframe.ClientListService;
      ClientListForm = this.iframe.ClientListForm;
      Deferred = this.iframe.Deferred;

      clientListService = sinon.createStubInstance(ClientListService);
      clientListService.load.returns(Deferred.createResolvedPromise('the list'));
      clientListService.save.returns(Deferred.createResolvedPromise());

      field = document.createElement('textarea');
      field.value = '';
      submitButton = document.createElement('button');
      submitButton.disabled = true;
      saveConfirmationMessage = document.createElement('span');
      document.body.appendChild(saveConfirmationMessage);

      clientListForm = new ClientListForm(clientListService, field, submitButton, saveConfirmationMessage);
      clientListForm.promise.then(done);
    });

    it('displays the loaded client list into the given field', function() {
      expect(field.value).to.equal('the list');
    });

    it('submits the client list when button is clicked', function() {
      this.type('the entered list').into(field);
      submitButton.click();

      expect(clientListService.save).to.have.been.calledWith(field.value);
    });

    it('disables the submit button while the data is being saved', function(done) {
      this.type('the entered list').into(field);
      expect(submitButton.disabled).to.be.false;
      submitButton.click();
      expect(submitButton.disabled).to.be.true;

      clientListForm.bind('saved', function() {
        expect(saveConfirmationMessage, 'save confirmation message').to.be.visible();
        expect(submitButton.disabled).to.be.false;
        done();
      });
    });

    afterEach(function() {
      document.body.removeChild(saveConfirmationMessage);
    });
  });

}());
