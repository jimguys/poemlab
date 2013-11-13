var sinon = require('sinon');
var assert = require('assert');
var _ = require('underscore');
var Poem = require('../../../server/model/poem')

describe('poem', function() {
  var poem;

  describe('creation', function() {
    var poets;
    var lines;

    beforeEach(function() {
      poets = [{id: 1}, {id: 2}, {id: 3}];
      lines = [{poetId: 1}, {poetId: 2}, {poetId: 3}];
      poem = Poem({}, poets, lines);
    });

    it('should assign position to each poet', function() {
      assert.equal(0, poem.poets[0].position);
      assert.equal(1, poem.poets[1].position);
      assert.equal(2, poem.poets[2].position);
    });

    it('should assign poet object to each line', function() {
      assert.equal(1, poem.lines[0].poet.id);
      assert.equal(2, poem.lines[1].poet.id);
      assert.equal(3, poem.lines[2].poet.id);
    });
  });

  describe('submitLine', function() {
    var line;
    var poet = { id: 345 };
    
    beforeEach(function() {
      line = { poetId: poet.id, text: 'abc' };
      poem = Poem({ id: 123 }, [poet]);
    });

    it('should emit lineSubmitted event', function(done) {
      poem.on('lineSubmitted', function(submittedLine) {
        assert.equal(line.text, submittedLine.text);
        done();
      });
      poem.submitLine(line);
    });

    it('should add to lines collection', function() {
      poem.submitLine(line);
      assert.equal(line.text, poem.lines[0].text);      
    });

    it('should return the submitted line with a poemId', function() {
      var submittedLine = poem.submitLine(line);
      assert.equal(poem.id, submittedLine.poemId)
    });

    it('should assign poet object to submitted line', function() {
      var submittedLine = poem.submitLine(line);
      assert.deepEqual(poet, submittedLine.poet);
    })
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
      assert.equal(3, poem.poets[0].id)
      assert.equal(1, poem.poets[1].id)
      assert.equal(2, poem.poets[2].id)
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