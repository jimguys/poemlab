const Browser = require('zombie');
const portfinder = require('portfinder');
const uuid = require('node-uuid');
var browserReady = require('./shared/browser')();

describe('User can setup an account and write a poem', function() {
  var browser;
  var testUser1 = 'test-' + uuid.v4();
  var testUser2 = 'test-' + uuid.v4();

  describe('register a user and logout', function() {
    it('user registers', function() {
      return browserReady.then(function(b) {
        browser = b;
        return browser.visit('/register');
      });
    });

    it('submit registration form', function() {
      browser
        .fill('username', testUser1)
        .fill('email', testUser1 + '@poemlab.com')
        .fill('password', testUser1 + 'password')
        .fill('confirm', testUser1 + 'password');
      return browser.pressButton('Sign Up');
    });

    it('click logout', function() {
      return browser.clickLink('logout');
    });
  });

  describe('register a second user', function() {
    it('navigate to register form', function() {
      return browser.visit('/register');
    });

    it('submit registration form', function() {
      browser
        .fill('username', testUser2)
        .fill('email', testUser2 + '@poemlab.com')
        .fill('password', testUser2 + 'password')
        .fill('confirm', testUser2 + 'password');
      return browser.pressButton('Sign Up');
    });
  });

  describe('second user creates a poem', function() {
    it('click new poem', function() {
      return browser.clickLink('.new-poem');
    });

    it('second user is already in poet list', function() {
      browser.assert.text('.poet:first-child', testUser2);
    });

    it('fill in form. add first user to poem', function() {
      browser
        .fill('name', uuid.v4())
        .fill('.poet-search', testUser1);
    });

    // it('first user is now in poet list', function() {
    //   browser.assert.text('.poet:last-child', testUser1);
    // });
  });
});
