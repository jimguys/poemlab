var respond = require('./common').respond;

module.exports = function(io, dbConfig) {
  var linesRepo = require("../lib/repositories/lines_repository")(dbConfig);

  return {
    create: function(req, res) {
      var lineData = {
        poet_id: req.user.id,
        poem_id: req.body.poem_id,
        text: req.body.text
      };

      linesRepo.create(lineData, function(err, poemLine) {
        if (err) {
          return console.error('***SOCKET.IO ERROR: ' + err);
        }
        var eventName = 'line-created-for-poem-' + lineData.poem_id;
        io.sockets.emit(eventName, poemLine);
        res.send(200);
      });
    }
  };

};
