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
      return browser.click('.poet:nth-of-type(1)');
    },

    start: function() {
      return browser.pressButton('Start Poem');
    },

    assertPoet: function(i, name) {
      browser.assert.text('.poet:nth-of-type(' + i + ')', name);
    },

    assertPoetCount: function(expected) {
      browser.assert.elements('.poet', 1);
    }
  };
}
