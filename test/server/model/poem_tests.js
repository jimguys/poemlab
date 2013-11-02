var sinon = require('sinon');
var assert = require('assert');
var _ = require('underscore');

describe('poem', function() {
  var poem;
  var line = { poetId: 123, text: 'abc' };
  
  beforeEach(function() {
    poem = require('../../../server/model/poem')({ id: 123 });
  });

  describe('submitLine', function() {
    it('should emit lineSubmitted event', function(done) {
      poem.on('lineSubmitted', function(submittedLine) {
        var expectedLine = _.extend({}, line, { poemId: poem.id });
        assert.deepEqual(expectedLine, submittedLine);
        done();
      });
      poem.submitLine(line);
    });

    it('should add to lines collection', function() {
      poem.submitLine(line);
      assert.deepEqual([line], poem.lines);      
    });
  });

  describe('selectNextPoet', function() {
    it('should select the next poet', function() {

    });
  })
})