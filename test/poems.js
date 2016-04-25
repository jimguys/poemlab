const Browser = require('zombie');
const portfinder = require('portfinder');
const uuid = require('node-uuid');
var expect = require('chai').expect;
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

    it('current user is already in poet list', function() {
      browser.assert.text('.poet:nth-of-type(1)', testUser2);
    });

    it('cannot remove the current user from the poet list', function() {
      return browser.click('.poet:nth-of-type(1)');
    });

    it('the current user is still in the poet list', function() {
      browser.assert.text('.poet:nth-of-type(1)', testUser2);
    });

    it('add another user to the poet list', function() {
      browser
        .fill('name', poemName)
        .fill('.poet-search', testUser1);
      return browser.click('.poet-search').then(function() {
        return browser.click('.tt-suggestion');
      });
    });

    it('the other user is now in poet list', function() {
      browser.assert.text('.poet:nth-of-type(2)', testUser1);
    });

    it('remove the other user from the poet list', function() {
      return browser.click('.poet:nth-of-type(2)');
    });

    it('the other user is no longer in the poet list', function() {
      browser.assert.elements('.poet', 1);
      browser.assert.text('.poet:nth-of-type(1)', testUser2);
    });

    it('add the other user back to the list', function() {
      browser
        .fill('name', poemName)
        .fill('.poet-search', testUser1);
      return browser.click('.poet-search').then(function() {
        return browser.click('.tt-suggestion');
      });
    });

    it('the other user is in the poet list again', function() {
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
      browser.fill('.new-line-text', line);
      return browser.click('.post-line');
    });

    it('should show the line in the poem', function() {
      browser.assert.text('.line:nth-of-type(1)', line);
    });
  });

  describe('users can edit their own lines', function() {
    var line1 = uuid.v4();
    var line2 = uuid.v4();

    it('click the line', function() {
      return browser.click('.line:nth-of-type(1) .line-text');
    });

    it('enter new text and submit', function() {
      browser.fill('.editable-input input', line1 + 'edit');
      return browser.click('.editable-submit');
    });

    it('should show the updated line', function() {
      browser.assert.text('.line:nth-of-type(1)', line1 + 'edit');
    });

    it('switch to the first user', function() {
      return browser.clickLink('logout').then(function() {
        browser
          .fill('username', testUser1)
          .fill('password', testUser1 + 'password');
        return browser.pressButton('Login');
      });
    });

    it('post another line in the poem', function() {
      return browser.clickLink('.poem:nth-of-type(1) a').then(function() {
        browser.fill('.new-line-text', line2)
        return browser.click('.post-line');
      });
    });

    it('should show that line in the poem too', function() {
      browser.assert.text('.line:nth-of-type(2)', line2);
    });

    it('should be able to edit the new line', function() {
      return browser.click('.line:nth-of-type(2) .line-text').then(function() {
        browser.fill('.editable-input input', line2 + 'edit');
        return browser.click('.editable-submit');
      });
    });

    it('should show both of the edited lines', function() {
      browser.assert.text('.line:nth-of-type(1)', line1 + 'edit');
      browser.assert.text('.line:nth-of-type(2)', line2 + 'edit');
    });

    it('should not be able to edit the first line, becaues it was posted by the other user', function() {
      return browser.click('.line:nth-of-type(1) .line-text').then(function() {
        expect(browser.query('.editable-submit')).not.to.exist;
      });
    });
  });
});
