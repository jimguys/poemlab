var EventEmitter = require('events').EventEmitter;
var _ = require('underscore');

module.exports = function Poem(attributes, poets, lines) {
  attributes = attributes || {};
  poets = poets || [];
  lines = lines || [];

  return _.extend({
    submitLine: function(line) {
      var submitted = _.extend({}, { poemId: attributes.id }, line);
      lines.push(submitted);
      this.emit('lineSubmitted', submitted);
      return submitted;
    },

    selectNextPoet: function() {
      var next = poets.splice(-1)[0];
      poets.splice(0, 0, next);
      return next;
    },

    lines: lines,
    poets: poets,
    id: attributes.id,
    name: attributes.name
  }, EventEmitter.prototype);
}
