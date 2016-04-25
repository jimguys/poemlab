module.exports = function poemNewPage(browser) {
  return {
    name: function(poemName) {
      browser.fill('name', poemName);
    },

    addPoet: function(name) {
      browser.fill('.poet-search', name);
      return browser.click('.poet-search').then(function() {
        return browser.click('.tt-suggestion');
      });
    },

    removePoet: function(i) {
      return browser.click('.poet:nth-of-type(' + i + ')');
    },

    start: function() {
      return browser.pressButton('Start Poem');
    },

    poet: function(i) {
      var p = browser.query('.poet:nth-of-type(' + i + ')');
      return p ? p.textContent : undefined;
    }
  };
}
