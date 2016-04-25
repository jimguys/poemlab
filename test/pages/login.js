module.exports = function loginPage(browser) {
  return {
    visit: function() {
      return browser.visit('/');
    },

    signup: function() {
      return browser.clickLink('Sign up');
    },

    submit: function(username, password) {
      browser
        .fill('username', username)
        .fill('password', password);
      return browser.pressButton('Login');
    },

    error: function() {
      return browser.query('.error').textContent;
    },

    assertOnPage: function() {
      browser.assert.text('h4', 'Welcome to Poemlab');
    }
  }
}
