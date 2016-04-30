const uuid = require('node-uuid');
var expect = require('chai').expect;
var browserReady = require('./shared/browser')();
var browser, pages;

describe('User can create an account and login', function() {
  this.timeout(8000);
  var testUser = 'test-' + uuid.v4();

  before(function() {
    return browserReady.then(function(b) {
      browser = b;
      pages = require('./pages')(browser);
      return pages.login.visit();
    });
  });

  describe('visits the registration page', function() {
    before(function() {
      return pages.login.signup();
    });

    it('should see the registration page', function() {
      pages.register.assertOnPage();
    });
  });

  describe('submits registration form', function() {
    before(function() {
      return pages.register.signup({
        username: testUser,
        email: testUser + '@poemlab.com',
        password: testUser + 'password'
      });
    });

    it('should see the logged in username', function() {
      expect(pages.username()).to.equal(testUser);
    });
  });

  describe('logs out', function() {
    before(function() {
      return pages.logout();
    });

    it('should see the login page', function() {
      return pages.login.assertOnPage();
    });
  });

  describe('logs back in', function() {
    before(function() {
      return pages.login.submit(testUser, testUser + 'password');
    });

    it('should see the logged in username', function() {
      expect(pages.username()).to.equal(testUser);
    });

    it('should see the poems page', function() {
      pages.poems.index.assertOnPage();
    });
  });

});

describe('User sees registration validation errors', function() {
  this.timeout(8000);
  var testUser = 'test-' + uuid.v4();

  before(function() {
    return pages.logout().then(function() {
      return pages.register.visit();
    });
  });

  describe('submit without required fields', function() {
    before(function() {
      return pages.register.signup({
        username: ''
      });
    });

    it('should still be on the registration page', function() {
      pages.register.assertOnPage();
    });
  });

  describe('submit with invalid email address', function() {
    before(function() {
      return pages.register.signup({
        username: testUser,
        email: 'not_a_valid_email_address',
        password: testUser + 'password'
      });
    });

    it('should show an error message', function() {
      expect(pages.register.error()).to.equal('The email address supplied doesn\'t look valid')
    });
  });

  describe('submit with mismatched password and confirmation', function() {
    before(function() {
      return pages.register.signup({
        username: testUser,
        email: testUser + '@poemlab.com',
        password: testUser + 'password',
        confirm: 'does_not_match'
      });
    });

    it('should show an error message', function() {
      expect(pages.register.error()).to.equal('Password and confirmation did not match');
    });
  });

  describe('submit duplicate account', function() {
    before(function() {
      return pages.register.signup({
        username: testUser,
        email: testUser + '@poemlab.com',
        password: testUser + 'password'
      }).then(function() {
        return pages.logout();
      }).then(function() {
        return pages.register.visit();
      })
    });

    describe('with username that is already taken', function() {
      before(function() {
        return pages.register.signup({
          username: testUser,
          email: uuid.v4() + '@poemlab.com',
          password: testUser + 'password'
        });
      });

      it('shows an error message', function() {
        expect(pages.register.error()).to.equal('That username has already been taken');
      });
    });

    describe('with email that is already taken', function() {
      before(function() {
        return pages.register.signup({
          username: uuid.v4(),
          email: testUser + '@poemlab.com',
          password: testUser + 'password'
        });
      });

      it('shows an error message', function() {
        expect(pages.register.error()).to.equal('That email has already been taken');
      });
    });
  });
});

describe('User sees login failure', function() {
  this.timeout(8000);
  var testUser = 'test-' + uuid.v4();

  before(function() {
    return pages.register.signup({
      username: testUser,
      email: testUser + '@poemlab.com',
      password: testUser + 'password'
    }).then(function() {
      return browser.clickLink('logout');
    });
  });

  describe('for incorrect username', function() {
    before(function() {
      return pages.login.submit(uuid.v4(), uuid.v4());
    });

    it('shows an error message', function() {
      expect(pages.login.error()).to.equal('Invalid username or password');
    });
  });


  describe('for incorrect password', function() {
    before(function() {
      return pages.login.submit(testUser, 'incorrect_password');
    });

    it('shows an error message', function() {
      expect(pages.login.error()).to.equal('Invalid username or password');
    });
  });

});
