var respond = require('./common').respond;

module.exports = function(io, dbConfig, poemRegistry) {
  var linesRepo = require("../repositories/lines_repository")(dbConfig);

  return {
    create: function(req, res, next) {
      poemRegistry.get(req.body.poemId, function(err, poem) {
        if (err) { next(err); }
        var lineData = {
          poetId: req.user.id,
          text: req.body.text
        };

        var line = poem.submitLine(lineData);
        var room = 'poem-' + line.poemId;
        io.sockets.in(room).emit('line-created-for-poem-' + line.poemId, line);

        var poet = poem.selectNextPoet();
        io.sockets.in(room).emit('poet-turn-in-poem-' + lineData.poemId, poet);
        res.send(200);
      });
    }
  };

};
