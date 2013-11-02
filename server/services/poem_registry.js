module.exports = function(dbConfig) {
  var poemsRepo = require('../repositories/poems_repository')(dbConfig);
  var linesRepo = require('../repositories/lines_repository')(dbConfig);
  var poetsRepo = require('../repositories/poets_repository')(dbConfig);
  var poems = {};

  return {
    get: function(poemId, callback) {
      poemsRepo.read(poemId, function(err, retrievedPoem) {
        if (err) { return callback(err); }
        poetsRepo.forPoem(poemId, function(err, poets) {
          if (err) { return callback(err); }
          linesRepo.forPoem(poemId, function(err, lines) {
            if (err) { return callback(err); }
            var poem = require('../model/poem')(retrievedPoem, poets, lines);
            poem.on('lineSubmitted', function(line) {
              linesRepo.create(line, function(err) {
                if (err) { return callback(err); }                
              });
            });
            callback(null, poem);
          });
        });
      });

      // retrieve poem and call callback
      // subscribe to events and wire up to repositories
    }
  };
}