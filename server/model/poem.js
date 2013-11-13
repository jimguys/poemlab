var EventEmitter = require('events').EventEmitter;
var _ = require('underscore');

module.exports = function Poem(attributes, poets, lines) {
  attributes = attributes || {};
  poets = poets || [];
  lines = lines || [];

  function poetFor(line) {
    return _.find(poets, function(poet) {
      return poet.id === line.poetId;
    });
  }

  _.each(poets, function(poet, i) { poet.position = i; });
  _.each(lines, function(line) { line.poet = poetFor(line); });

  return _.extend({
    submitLine: function(line) {
      var submitted = _.extend({}, { poemId: attributes.id, poet: poetFor(line) }, line);
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
