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

    assertName: function(expected) {
      browser.assert.text('h1', expected);
    },

    assertPoet: function(i, name) {
      browser.assert.text('.poet:nth-of-type(' + i + ')', name);
    },

    assertLine: function(i, line) {
      browser.assert.text('.line:nth-of-type(' + i + ')', line);
    },

    assertNotEditing: function() {
      expect(browser.query('.editable-submit')).not.to.exist;
    }
  };
}
