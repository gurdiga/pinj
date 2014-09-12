(function() {
  'use strict';

  describe('Registration form', function() {
    var App, Deferred, querySelector, RegistrationForm, jQuery, InputFocuser;
    var form, email, password;

    before(function(done) {
      App = this.iframe.App;
      Deferred = this.iframe.Deferred;
      querySelector = this.iframe.querySelector;
      RegistrationForm = this.iframe.RegistrationForm;
      jQuery = this.iframe.jQuery;
      InputFocuser = this.iframe.InputFocuser;

      email = 'registration-form@test.com';
      password = 'Passw0rd';

      form = querySelector('#registration-form');
      activateTab(form).then(done);
    });

    it('has the appropriate UI elements', function() {
      expect(form).to.containElements([
        'input#registration-email',
        'label[for="registration-email"]',
        'input[type="password"]#registration-password',
        'label[for="registration-password"]',
        'input[type="password"]#registration-password-confirmation',
        'label[for="registration-password-confirmation"]'
      ]);
    });

    describe('constructor', function() {
      var registrationForm, form;

      beforeEach(function() {
        form = document.createElement('form');
        registrationForm = new RegistrationForm(form);
      });

      it('eventifies the given form', function() {
        expect(form.trigger).to.be.a('function');
        expect(form.bind).to.be.a('function');
      });

      it('initializes validation', function() {
        expect(jQuery(form).data('bootstrapValidator'), 'validation meta-data').to.be.an('object');
      });
    });

    it('focuses the first field automatically', function(done) {
      setTimeout(function() {
        var emailField = querySelector('#registration-email', form);
        expect(emailField).to.be.focused();

        done();
      }, InputFocuser.DELAY);
    });


    describe('validation', function() {
      var emailField, passwordField, passwordConfirmationField, submitButton;

      beforeEach(function() {
        emailField = querySelector('#registration-email', form);
        passwordField = querySelector('#registration-password', form);
        passwordConfirmationField = querySelector('#registration-password-confirmation', form);
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

        it('hides the error messsage after the email was corrected', function() {
          this.type('syntactically incorrect').into(emailField);
          submit();
          this.type('syntacticallycorrect@email.com').into(emailField);
          submit();
          expect(invalidEmailErrorMessage(), 'error message').not.to.be.visible();
        });

        function emailMissingErrorMessage() {
          return querySelector('[data-bv-for="registration-email"][data-bv-validator="notEmpty"]', form);
        }

        function invalidEmailErrorMessage() {
          return querySelector('[data-bv-for="registration-email"][data-bv-validator="emailAddress"]', form);
        }
      });

      describe('password fields', function() {
        beforeEach(function() {
          this.type(email).into(emailField);
        });

        it('shows an erorr message when empty and focuses it', function() {
          this.type('').into(passwordField);
          submit();
          expect(passwordIsEmptyErrorMessage(), 'error messsage').to.be.visible();
          expect(passwordField).to.be.focused();
        });

        it('shows error messsage only for the password confirmation field when empty', function() {
          this.type('Passw0rd').into(passwordField);
          this.type('').into(passwordConfirmationField);
          submit();
          expect(passwordIsEmptyErrorMessage()).not.to.be.visible();
          expect(passwordConfirmationIsEmptyErrrorMessage()).to.be.visible();
          expect(passwordField).to.be.focused();
        });

        it('shows an error message when password and confirmation do not match', function() {
          this.type('Passw0rd').into(passwordField);
          this.type('Something else').into(passwordConfirmationField);
          submit();
          expect(passwordIsEmptyErrorMessage()).not.to.be.visible();
          expect(passwordConfirmationMissmatchErrrorMessage()).to.be.visible();
        });

        it('hides the error messages when password and confirmation match', function() {
          this.type('').into(emailField);
          this.type('Passw0rd').into(passwordField);
          this.type('Something elese').into(passwordConfirmationField);
          submit();
          this.type('Passw0rd').into(passwordField);
          this.type('Passw0rd').into(passwordConfirmationField);
          submit();
          expect(passwordIsEmptyErrorMessage(), 'password error messsage').not.to.be.visible();
          expect(passwordConfirmationIsEmptyErrrorMessage(), 'password confirmation error messsage').not.to.be.visible();
        });

        function passwordIsEmptyErrorMessage() {
          return querySelector('[data-bv-for="registration-password"][data-bv-validator="notEmpty"]', form);
        }

        function passwordConfirmationIsEmptyErrrorMessage() {
          return querySelector('[data-bv-for="registration-password-confirmation"][data-bv-validator="notEmpty"]', form);
        }

        function passwordConfirmationMissmatchErrrorMessage() {
          return querySelector('[data-bv-for="registration-password-confirmation"][data-bv-validator="identical"]', form);
        }
      });

      describe('interaction with user service', function() {
        describe('when email, password, and conformation are correctlty entered', function() {
          beforeEach(function() {
            this.sinon.stub(App.userService, 'registerUser', Deferred.createResolvedPromise);
            this.sinon.stub(App.userService, 'authenticateUser', Deferred.createResolvedPromise);
          });

          it('prevents the default submit action, registers a new user, and logs them in', function(done) {
            var submitEventPrevented = false;

            form.addEventListener('submit', function(event) {
              expect(event.defaultPrevented).to.be.true;
              submitEventPrevented = true;
            });

            this.type(email).into(emailField);
            this.type(password).into(passwordField);
            this.type(password).into(passwordConfirmationField);
            submit();

            setTimeout(this.bubbleErrors(function() {
              var registerUser = App.userService.registerUser;
              var authenticateUser = App.userService.authenticateUser;

              expect(submitEventPrevented).to.be.true;
              expect(registerUser).to.have.been.calledWith(emailField.value, passwordField.value);

              expect(authenticateUser).to.have.been.calledWith(emailField.value, passwordField.value);
              expect(authenticateUser).to.have.been.calledAfter(registerUser);
              done();
            }));
          });

          afterEach(function restoreUnauthenticatedView() {
            App.userService.trigger('deauthenticated');
          });
        });

        describe('when registration fails because login is taken', function() {
          beforeEach(function() {
            var emailTakenError = new Error();
            emailTakenError.code = 'EMAIL_TAKEN';

            var failedOutcome = Deferred.createRejectedPromise(emailTakenError);
            this.sinon.stub(App.userService, 'registerUser').returns(failedOutcome);
          });

          it('displays an error about that', function(done) {
            form.once('registration-error-message-displayed', function() {
              var registrationErrorrMessage = querySelector('#registration-error', form);
              expect(registrationErrorrMessage, 'registration errorr message').to.exist;
              done();
            });

            this.type(email).into(emailField);
            this.type(password).into(passwordField);
            this.type(password).into(passwordConfirmationField);
            submit();
          });
        });

        describe('when registration fails because of an unknown errorr', function() {
          var unknownErrorError = new Error();
          unknownErrorError.code = 'ABRA_CADABRA';

          beforeEach(function() {
            var failedOutcome = Deferred.createRejectedPromise(unknownErrorError);
            this.sinon.stub(App.userService, 'registerUser').returns(failedOutcome);
          });

          it('displays and error message containing its code', function(done) {
            form.once('registration-error-message-displayed', function() {
              var registrationErrorrMessage = querySelector('#registration-error', form);
              expect(registrationErrorrMessage.textContent).to.contain(unknownErrorError.code);
              done();
            });

            this.type(email).into(emailField);
            this.type(password).into(passwordField);
            this.type(password).into(passwordConfirmationField);
            submit();
          });
        });

        describe('on logout', function() {
          it('resets the form', function() {
            this.type('registration-form@test.com').into(emailField);
            this.type('Passw0rd').into(passwordField);
            App.userService.trigger('deauthenticated');

            expect(emailField.value).to.be.empty;
            expect(passwordField.value).to.be.empty;
            expect(passwordConfirmationField.value).to.be.empty;
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
          var tabLabel = querySelector('a[data-toggle="tab"][href="#registration-tab"]', form.ownerDocument);
          tabLabel.click();
          setTimeout(done, 200);
        }
      };
    }
  });

}());
