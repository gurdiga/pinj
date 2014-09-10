(function() {
  'use strict';

  describe('Authentication form', function() {
    var AuthenticationForm, UserService, Deferred, App, querySelector, jQuery;
    var form;

    beforeEach(function(done) {
      AuthenticationForm = this.iframe.AuthenticationForm;
      UserService = this.iframe.UserService;
      Deferred = this.iframe.Deferred;
      App = this.iframe.App;
      querySelector = this.iframe.querySelector;
      jQuery = this.iframe.jQuery;

      App.userService.logout();
      form = querySelector('#authentication-form');
      activateTab(form).then(done);
    });

    it('is active by default', function() {
      expect(form).to.be.visible();
    });

    it('has the appropriate UI elements', function() {
      expect(form).to.containElements([
        'input#authentication-email',
        'label[for="authentication-email"]',
        'input[type="password"]#authentication-password',
        'label[for="authentication-password"]',
        'button[type="submit"]'
      ]);
    });

    describe('constructor', function() {
      it('eventifies the given form', function() {
        expect(form.trigger).to.be.a('function');
        expect(form.bind).to.be.a('function');
      });

      it('initializes validation', function() {
        expect(jQuery(form).data('bootstrapValidator')).to.be.an('object');
      });
    });

    describe('validation', function() {
      var emailField, passwordField, submitButton;

      beforeEach(function() {
        emailField = querySelector('#authentication-email', form);
        passwordField = querySelector('#authentication-password', form);
        submitButton = querySelector('button[type="submit"]', form);
      });

      describe('email field', function() {
        it('shows an error message when the email is empty', function() {
          this.type('').into(emailField);
          submit();
          expect(emailMissingErrorMessage(), 'error message').to.be.visible();
          expect(emailField).to.be.focused();
        });

        it('shows an error message when the email is syntactically incorrect and focuses it', function() {
          this.type('syntactically incorrect').into(emailField);
          submit();
          expect(invalidEmailErrorMessage(), 'error message').to.be.visible();
          expect(emailField).to.be.focused();
        });

        function emailMissingErrorMessage() {
          return querySelector('[data-bv-for="authentication-email"][data-bv-validator="notEmpty"]', form);
        }

        function invalidEmailErrorMessage() {
          return querySelector('[data-bv-for="authentication-email"][data-bv-validator="emailAddress"]', form);
        }
      });

      describe('password fields', function() {
        it('shows an erorr message when empty and focuses it', function() {
          this.type('authentication-form@test.com').into(emailField);
          this.type('').into(passwordField);
          submit();
          expect(passwordIsEmptyErrorMessage(), 'error messsage').to.be.visible();
          expect(passwordField).to.be.focused();
        });

        function passwordIsEmptyErrorMessage() {
          return querySelector('[data-bv-for="authentication-password"][data-bv-validator="notEmpty"]', form);
        }
      });

      describe('interaction with user service', function() {
        describe('when email and password are correctly entered', function() {
          beforeEach(function() {
            var successfulOutcome = Deferred.createResolvedPromise;
            this.sinon.stub(App.userService, 'authenticateUser', successfulOutcome);
          });

          it('prevents the default submit action and authenticates the user', function() {
            var submitEventPrevented = false;

            form.addEventListener('submit', function(event) {
              expect(event.defaultPrevented).to.be.true;
              submitEventPrevented = true;
            });

            this.type('authentication-form@test.com').into(emailField);
            this.type('Passw0rd').into(passwordField);
            submit();

            var authenticateUser = App.userService.authenticateUser;

            expect(submitEventPrevented).to.be.true;
            expect(authenticateUser).to.have.been.calledWith(
              emailField.value,
              passwordField.value
            );
          });

          afterEach(function restoreUnauthenticatedView() {
            App.userService.trigger('deauthenticated');
          });
        });

        describe('when authentication fails because email is incorrect', function() {
          beforeEach(function() {
            var emailUnrecognizedError = new Error();
            emailUnrecognizedError.code = 'INVALID_USER';

            var failedOutcome = Deferred.createRejectedPromise.bind(this, emailUnrecognizedError);
            this.sinon.stub(App.userService, 'authenticateUser', failedOutcome);
          });

          it('displays an error about that', function(done) {
            form.once('authentication-error-message-displayed', function() {
              var authenticationErrorrMessage = querySelector('#authentication-error', form);
              expect(authenticationErrorrMessage, 'authentication errorr message').to.exist;
              expect(authenticationErrorrMessage.textContent).to.contain('Adresa de email este incorectă');
              done();
            });

            this.type('authentication-form@test.com').into(emailField);
            this.type('Passw0rd').into(passwordField);
            submit();
          });
        });

        describe('when authentication fails because password is incorrect', function() {
          beforeEach(function() {
            var invalidPasswordError = new Error('Invalid password');
            invalidPasswordError.code = 'INVALID_PASSWORD';

            var failedOutcome = Deferred.createRejectedPromise.bind(this, invalidPasswordError);
            this.sinon.stub(UserService.prototype, 'authenticateUser', failedOutcome);
          });

          it('displays an error about that', function(done) {
            form.once('authentication-error-message-displayed', function() {
              var authenticationErrorrMessage = querySelector('#authentication-error', form);
              expect(authenticationErrorrMessage, 'authentication errorr message').to.exist;
              expect(authenticationErrorrMessage.textContent).to.contain('Parola este incorectă');
              done();
            });

            this.type('authentication-form@test.com').into(emailField);
            this.type('Passw0rd').into(passwordField);
            submit();
          });
        });

        describe('when authentication fails because of an unknown error', function() {
          var unknownErrorError = new Error('Unknown error');
          unknownErrorError.code = 'ABRA_CADABRA';

          beforeEach(function() {
            var failedOutcome = Deferred.createRejectedPromise.bind(this, unknownErrorError);
            this.sinon.stub(UserService.prototype, 'authenticateUser', failedOutcome);
          });

          it('displays and error message containing its code', function(done) {
            form.once('authentication-error-message-displayed', function() {
              var authenticationErrorrMessage = querySelector('#authentication-error', form);
              expect(authenticationErrorrMessage, 'authentication errorr message').to.exist;
              expect(authenticationErrorrMessage.textContent).to.contain(unknownErrorError.code);
              done();
            });

            this.type('authentication-form@test.com').into(emailField);
            this.type('Passw0rd').into(passwordField);
            submit();
          });
        });

        describe('on logout', function() {
          it('resets the form', function() {
            this.type('authentication-form@test.com').into(emailField);
            this.type('Passw0rd').into(passwordField);
            App.userService.trigger('deauthenticated');

            expect(emailField).to.be.focused();
            expect(emailField.value).to.be.empty;
            expect(passwordField.value).to.be.empty;
          });
        });
      });

      function submit() {
        submitButton.disabled = false;
        submitButton.click();
      }
    });

    function activateTab(form) {
      return {
        then: function(done) {
          var tabLabel = querySelector('a[data-toggle="tab"][href="#authentication-tab"]', form.ownerDocument);
          tabLabel.click();
          setTimeout(done, 200);
        }
      };
    }
  });

}());
