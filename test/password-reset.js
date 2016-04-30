const uuid = require('node-uuid');
var expect = require('chai').expect;
var browserReady = require('./shared/browser')();
var browser, pages;

describe('User can reset a lost password', function() {
  var testUser = 'test-' + uuid.v4();
  var testUserEmail = testUser + '@poemlab.com';
  var emailLink;

  before(function() {
    return browserReady.then(function(b) {
      browser = b;
      pages = require('./pages')(browser);
      return pages.register.visit();
    }).then(function() {
      return pages.register.signup({
        username: testUser,
        email: testUserEmail,
        password: testUser + 'password'
      });
    }).then(function() {
      return pages.logout();
    });
  });

  describe('clicks the reset password link', function() {
    before(function() {
      return pages.login.resetPassword();
    });

    it('should see the password reset page', function() {
      pages.passwordReset.assertOnPage();
    });
  });

  describe('submits an email address', function() {
    before(function() {
      return pages.passwordReset.submit({ email: testUserEmail });
    });

    it('should have sent an email containing a generated token', function() {
      expect(global.mockMailerTransport.sentMail).to.exist;
      var message = global.mockMailerTransport.sentMail[0].data;
      emailLink = /(http:\S*)/.exec(message.text)[1];
      expect(emailLink).to.exist;
    });
  });

  describe('follows the link in the email', function() {
    before(function() {
      return browser.visit(emailLink);
    });

    it('should see the change password page', function() {
      pages.passwordChange.assertOnPage();
    });
  });

  describe('changes the password', function() {
    before(function() {
      return pages.passwordChange.submit({
        password: testUser + 'changed'
      });
    });

    it('should see success message', function() {
      expect(pages.passwordChange.successMessage()).to.equal('Your password has been changed');
    });
  });

  describe('can login with new password', function() {
    before(function() {
      return pages.login.visit().then(function() {
        return pages.login.submit(testUser, testUser + 'changed');
      });
    });

    it('should log the user in', function() {
      pages.poems.index.assertOnPage();
    });
  });

  describe('cannot follow the link after the password has been changed', function() {
    before(function() {
      return pages.logout().then(function() {
        return browser.visit(emailLink);
      });
    });

    it('should show an error message', function() {
      expect(pages.passwordChange.error()).to.equal('Password reset request has expired.');
    });
  });

  describe('submit an email address that is not in the system', function() {
    before(function() {
      return pages.passwordReset.visit().then(function() {
        return pages.passwordReset.submit({
          email: uuid.v4() + '@poemlab.com'
        });
      });
    });

    it('should show an error', function() {
      expect(pages.passwordReset.error()).to.equal('Email address not found');
    });
  });

});
