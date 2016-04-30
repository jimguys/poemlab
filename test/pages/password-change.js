module.exports = function registerPage(browser) {
  return {
    error: function() {
      return browser.query('.alert').textContent;
    },

    submit: function(opts) {
      browser
        .fill('password', opts.password)
        .fill('confirm', opts.confirm || opts.password);
      return browser.pressButton('Change Password');
    },

    successMessage: function() {
      return browser.query('.success').textContent;
    },

    assertOnPage: function() {
      browser.assert.text('h4', 'Password Reset');
    }
  };
}
