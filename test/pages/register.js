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

    error: function() {
      return browser.query('.error').textContent;
    },

    assertOnPage: function() {
      browser.assert.text('h4', 'Poemlab Registration');
    }
  };
}
