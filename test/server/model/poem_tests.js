var sinon = require('sinon');
var assert = require('assert');
var _ = require('underscore');
var Poem = require('../../../server/model/poem')

describe('poem', function() {
  var poem;

  describe('submitLine', function() {
    var poemId = 123;
    var line = { poetId: 234, text: 'abc' };
    var expectedLine = _.extend({}, line, { poemId: poemId });
    
    beforeEach(function() {
      poem = Poem({ id: poemId });
    });

    it('should emit lineSubmitted event', function(done) {
      poem.on('lineSubmitted', function(submittedLine) {
        assert.deepEqual(expectedLine, submittedLine);
        done();
      });
      poem.submitLine(line);
    });

    it('should add to lines collection', function() {
      poem.submitLine(line);
      assert.deepEqual([expectedLine], poem.lines);      
    });

    it('should return the submitted line with a poemId', function() {
      var submittedLine = poem.submitLine(line);
      assert.deepEqual(expectedLine, submittedLine)
    });
  });

  describe('selectNextPoet', function() {
    var poets;

    beforeEach(function() {
      poets = [{ id: 1 }, { id: 2 }, { id: 3 }];
      poem = Poem({}, poets);
    });

    it('should return the selected poet', function() {
      var selected = poem.selectNextPoet();
      assert.equal(3, selected.id);
    });

    it('should move the selected poet to the head of the list', function() {
      poem.selectNextPoet();
      assert.deepEqual([{ id: 3 }, { id: 1 }, { id: 2 }], poem.poets)
    });

    it('should return the poet given poem with one poet', function() {
      poem = Poem({}, [poets[0]]);
      var selected = poem.selectNextPoet();
      assert.equal(poets[0].id, selected.id)
    })

    it('should return undefined given no poets', function() {
      poem = Poem();
      assert.equal(undefined, poem.selectNextPoet());
    });
  })
})