const Browser = require('zombie');
const portfinder = require('portfinder');
const uuid = require('node-uuid');

var browserReady = new Promise(function(fulfill, reject) {
  portfinder.getPort(function (err, port) {
    process.env.PORT = port;
    require('../app');
  });

  process.on('ready', function(port) {
    Browser.localhost('localhost', port);
    fulfill();
  });
});

describe('User can create an account and login', function() {
  const browser = new Browser();
  var testUser = 'test-' + uuid.v4();

  before(function() {
    return browserReady.then(function() {
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
