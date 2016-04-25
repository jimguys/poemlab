module.exports = function(browser) {
  return {
    register: require('./register')(browser),
    login: require('./login')(browser),
    poems: {
      index: require('./poems/index')(browser),
      new: require('./poems/new')(browser),
      edit: require('./poems/edit')(browser)
    },

    logout: function() {
      return browser.clickLink('logout');
    },

    assertUsername: function(username) {
      browser.assert.text('.loggedin-username', username);
    }
  }
}
