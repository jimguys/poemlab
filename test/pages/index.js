module.exports = function(browser) {
  return {
    register: require('./register')(browser),
    login: require('./login')(browser),
    passwordReset: require('./password-reset')(browser),
    passwordChange: require('./password-change')(browser),
    poems: {
      index: require('./poems/index')(browser),
      new: require('./poems/new')(browser),
      edit: require('./poems/edit')(browser)
    },

    logout: function() {
      return browser.clickLink('logout');
    },

    username: function() {
      return browser.query('.loggedin-username').textContent.trim();
    }
  }
}
