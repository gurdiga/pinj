(function() {
  'use strict';

  function AuthenticationForm(form, userService) {
    MicroEvent.mixin(form);

    this.form = form;
    this.userService = userService;

    this.initValidation();
    this.setSubmitHandler();
    this.setAuthenticationErrorHandler();
    this.setLogoutHandler();
  }

  AuthenticationForm.prototype.initValidation = function() {
    jQuery(this.form).bootstrapValidator({
      live: 'submitted',
      feedbackIcons: {
        valid: 'glyphicon glyphicon-ok',
        invalid: 'glyphicon glyphicon-remove',
        validating: 'glyphicon glyphicon-refresh'
      },
      fields: {
        'authentication-email': {
          validators: {
            notEmpty: {
              message: 'Introduceţi adresa de email'
            },
            emailAddress: {
              message: 'Adresa este incorectă sintactic'
            }
          }
        },
        'authentication-password': {
          validators: {
            notEmpty: {
              message: 'Introduceţi parola'
            }
          }
        }
      }
    });
  };

  AuthenticationForm.prototype.setSubmitHandler = function() {
    var form = this.form;
    var userService = this.userService;

    jQuery(form).on('success.form.bv', function(event) {
      event.preventDefault();

      var email = form['authentication-email'].value;
      var password = form['authentication-password'].value;

      userService.authenticateUser(email, password)
      .catch(function(error) {
        var ERROR_MESSAGES = {
          'INVALID_USER': 'Adresa de email este incorectă',
          'INVALID_PASSWORD': 'Parola este incorectă',
          'fallback': 'A intervenit o eroare neprevăzută (%CODE%).'
        };
        var errorMessage = ERROR_MESSAGES[error.code];

        errorMessage = errorMessage || fallbackMessage();
        form.trigger('authentication-failed', errorMessage);

        function fallbackMessage() {
          var code = error.code || error.toString();
          return ERROR_MESSAGES['fallback'].replace('%CODE%', code);
        }
      });
    });
  };

  AuthenticationForm.prototype.setAuthenticationErrorHandler = function() {
    var form = this.form;

    form.bind('authentication-failed', function(errorMessage) {
      var errorMessageElement = DOM.querySelector('#authentication-error');

      errorMessageElement.textContent = errorMessage;
      errorMessageElement.style.display = 'block';

      form.trigger('authentication-error-message-displayed');
    });
  };

  AuthenticationForm.prototype.setLogoutHandler = function() {
    this.userService.bind('deauthenticated', this.resetForm.bind(this));
  };

  AuthenticationForm.prototype.resetForm = function() {
    var tabId = jQuery(this.form).parent('.tab-pane').attr('id');
    var tabLabel = jQuery('a[data-toggle="tab"][href="#' + tabId + '"]');
    var tabPane = jQuery(tabLabel.attr('href'));

    if (tabPane.is(':visible')) tabLabel.trigger('shown.bs.tab');
    else tabLabel.trigger('click');

    this.form.trigger('reset');
  };

  window.AuthenticationForm = AuthenticationForm;

}());
