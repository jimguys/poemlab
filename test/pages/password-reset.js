module.exports = function passwordResetPage(browser) {
  return {
    visit: function() {
      return browser.visit('/reset');
    },

    submit: function(opts) {
      browser.fill('email', opts.email);
      return browser.pressButton('Send Email');
    },

    error: function() {
      return browser.query('.alert').textContent;
    },

    assertOnPage: function() {
      browser.assert.text('h4', 'Reset Password');
    }
  };
}
