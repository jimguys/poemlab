var respond = require('./common').respond;

module.exports = function(io, dbConfig) {
  var linesRepo = require("../repositories/lines_repository")(dbConfig);

  return {
    create: function(req, res) {
      var lineData = {
        poetId: req.user.id,
        poemId: req.body.poemId,
        text: req.body.text
      };

      linesRepo.create(lineData, function(err, poemLine) {
        if (err) {
          return console.error('***SOCKET.IO ERROR: ' + err);
        }
        var eventName = 'line-created-for-poem-' + lineData.poemId;
        io.sockets.in('poem-' + lineData.poemId).emit(eventName, poemLine);
        res.send(200);
      });
    }
  };

};
