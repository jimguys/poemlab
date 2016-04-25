module.exports = function poemIndexPage(browser) {
  return {
    new: function() {
      return browser.clickLink('.new-poem');
    },

    select: function(i) {
      return browser.clickLink('.poem:nth-of-type(' + i + ') a');
    },

    assertOnPage: function() {
      browser.assert.text('h1', 'Poems');
    }
  };
}
