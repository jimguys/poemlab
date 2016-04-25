module.exports = function registerPage(browser) {
  return {
    visit: function() {
      return browser.visit('/register');
    },

    signup: function(opts) {
      browser
        .fill('username', opts.username)
        .fill('email', opts.email)
        .fill('password', opts.password)
        .fill('confirm', opts.confirm || opts.password);
      return browser.pressButton('Sign Up');
    },

    assertOnPage: function() {
      browser.assert.text('h1', 'Poemlab Registration');
    },

    assertError: function(error) {
      browser.assert.text('.error', error);
    }

  };
}
