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
      browser.assert.text('.username', testUser);
    });
  });

  describe('logs out', function() {
    before(function() {
      return browser.clickLink('logout');
    });

    it('should see the login page', function() {
      browser.assert.text('h4', 'Welcome to Poemlab');
    })
  });

  describe('logs back in', function() {
    before(function() {
      browser
        .fill('username', testUser)
        .fill('password', testUser + 'password');
      return browser.pressButton('Login');
    });

    it('should see the poems page', function() {
      browser.assert.text('h1', 'Poems');
    });
  });
});
