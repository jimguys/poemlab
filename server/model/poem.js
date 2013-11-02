var EventEmitter = require('events').EventEmitter;
var _ = require('underscore');

module.exports = function Poem(attributes, poets, lines) {
  attributes = attributes || {};
  poets = poets || [];
  lines = lines || [];

  return _.extend({
    submitLine: function(line, callback) {
      lines.push(line);
      var submitted = _.extend({}, { poemId: attributes.id }, line);
      this.emit('lineSubmitted', submitted);
      return submitted;
    },

    selectNextPoet: function(callback) {

    },

    lines: lines,
    poets: poets,
    id: attributes.id,
    name: attributes.name
  }, EventEmitter.prototype);
}
