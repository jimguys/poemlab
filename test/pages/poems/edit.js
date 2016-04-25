var expect = require('chai').expect;

module.exports = function poemEditPage(browser) {
  return {
    postLine: function(line) {
      browser.fill('.new-line-text', line);
      return browser.click('.post-line');
    },

    editLine: function(i) {
      return browser.click('.line:nth-of-type(' + i + ') .line-text');
    },

    postEdit: function(text) {
      browser.fill('.editable-input input', text);
      return browser.click('.editable-submit');
    },

    name: function() {
      return browser.query('h1 span').textContent;
    },

    poet: function(i) {
      var p = browser.query('.poet:nth-of-type(' + i + ')');
      return p ? p.textContent : undefined;
    },

    line: function(i) {
      return browser.query('.line:nth-of-type(' + i + ')').textContent;
    },

    assertNotEditing: function() {
      expect(browser.query('.editable-submit')).not.to.exist;
    }
  };
}
