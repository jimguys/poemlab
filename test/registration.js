const uuid = require('node-uuid');
var browserReady = require('./shared/browser')();

describe('User can create an account and login', function() {
  var testUser = 'test-' + uuid.v4();

  before(function() {
    return browserReady.then(function(b) {
      browser = b;
      return browser.visit('/');
    });
  });

  describe('visits the registration page', function() {
    before(function() {
      return browser.clickLink('Sign up');
    });

    it('should see the registration page', function() {
      browser.assert.text('h1', 'Poemlab Registration');
    });
  });

  describe('submits registration form', function() {
    before(function() {
      browser
        .fill('username', testUser)
        .fill('email', testUser + '@poemlab.com')
        .fill('password', testUser + 'password')
        .fill('confirm', testUser + 'password');
      return browser.pressButton('Sign Up');
    });

    it('should see the logged in username', function() {
      browser.assert.text('.loggedin-username', testUser);
    });
  });

  describe('logs out', function() {
    before(function() {
      return browser.clickLink('logout');
    });

    it('should see the login page', function() {
      browser.assert.text('h4', 'Welcome to Poemlab');
    });
  });

  describe('logs back in', function() {
    before(function() {
      browser
        .fill('username', testUser)
        .fill('password', testUser + 'password');
      return browser.pressButton('Login');
    });

    it('should see the logged in username', function() {
      browser.assert.text('.loggedin-username', testUser);
    });

    it('should see the poems page', function() {
      browser.assert.text('h1', 'Poems');
    });
  });

});

describe('User sees registration validation errors', function() {
  var testUser = 'test-' + uuid.v4();

  before(function() {
    return browser.clickLink('logout').then(function() {
      return browser.visit('/register');
    });
  });

  describe('submit without required fields', function() {
    before(function() {
      browser.fill('username', '');
      return browser.pressButton('Sign Up')
    });

    it('should still be on the registration page', function() {
      browser.assert.text('h1', 'Poemlab Registration');
    });
  });

  describe('submit with invalid email address', function() {
    before(function() {
      browser
        .fill('username', testUser)
        .fill('email', 'not_a_valid_email_address')
        .fill('password', testUser + 'password')
        .fill('confirm', testUser + 'password');
      return browser.pressButton('Sign Up');
    });

    it('should show an error message', function() {
      browser.assert.text('.error', 'The email address supplied doesn\'t look valid');
    });
  });

  describe('submit with mismatched password and confirmation', function() {
    before(function() {
      browser
        .fill('username', testUser)
        .fill('email', testUser + '@poemlab.com')
        .fill('password', testUser + 'password')
        .fill('confirm', 'does_not_match');
      return browser.pressButton('Sign Up');
    });

    it('should show an error message', function() {
      browser.assert.text('.error', 'Password and confirmation did not match');
    });
  });

  describe('submit duplicate account', function() {
    before(function() {
      browser
        .fill('username', testUser)
        .fill('email', testUser + '@poemlab.com')
        .fill('password', testUser + 'password')
        .fill('confirm', testUser + 'password');
      return browser.pressButton('Sign Up').then(function() {
        return browser.clickLink('logout');
      }).then(function() {
        return browser.visit('/register');
      });
    });

    describe('with username that is already taken', function() {
      before(function() {
        browser
          .fill('username', testUser)
          .fill('email', uuid.v4() + '@poemlab.com')
          .fill('password', testUser + 'password')
          .fill('confirm', testUser + 'password');
        return browser.pressButton('Sign Up');
      });

      it('shows an error message', function() {
        browser.assert.text('.error', 'That username has already been taken');
      });
    });

    describe('with email that is already taken', function() {
      before(function() {
        browser
          .fill('username', uuid.v4())
          .fill('email', testUser + '@poemlab.com')
          .fill('password', testUser + 'password')
          .fill('confirm', testUser + 'password');
        return browser.pressButton('Sign Up');
      });

      it('shows an error message', function() {
        browser.assert.text('.error', 'That email has already been taken');
      });
    });
  });
});
