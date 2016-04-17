const Browser = require('zombie');
const portfinder = require('portfinder');
const uuid = require('node-uuid');
var browserReady = require('./shared/browser')();

describe('User can setup an account and write a poem', function() {
  var browser;
  var poemName = uuid.v4();
  var testUser1 = 'test-1-' + uuid.v4();
  var testUser2 = 'test-2-' + uuid.v4();

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
      browser.assert.text('.poet:nth-of-type(1)', testUser2);
    });

    it('fill in form. add first user to poem', function() {
      browser
        .fill('name', poemName)
        .fill('.poet-search', testUser1);
      return browser.click('.poet-search');
    });

    it('select a poet to add it to the poem', function() {
      return browser.click('.tt-suggestion');
    });

    it('first user is now in poet list', function() {
      browser.assert.text('.poet:nth-of-type(2)', testUser1);
    });

    it('start the poem', function() {
      return browser.pressButton('Start Poem');
    });
  });

  describe('users write a poem', function() {
    var line = uuid.v4();

    it('should see the poem name', function() {
      browser.assert.text('h1', poemName);
    });

    it('should see the poets', function() {
      browser.assert.text('.poet:nth-of-type(1)', testUser2);
      browser.assert.text('.poet:nth-of-type(2)', testUser1);
    });

    it('write a new line', function() {
      browser.fill('.line-text', line);
      return browser.click('.post-line');
    });

    it('should show the line in the poem', function() {
      browser.assert.text('.line:nth-of-type(1)', line);
    });
  });
});
