var respond = require('./common').respond;

module.exports = function(db, io) {
  var linesRepo = require("../repositories/lines_repository")(db);
  return {
    create: function(req, res) {
      var lineData = {
        poetId: req.user.id,
        poemId: req.body.poemId,
        text: req.body.text
      };

      linesRepo.create(lineData, function(err, poemLine) {
        if (err) { return process.emit('error', err, 'SOCKET.IO ERROR'); }
        var eventName = 'line-created-for-poem-' + lineData.poemId;
        io.sockets.in('poem-' + lineData.poemId).emit(eventName, poemLine);
        res.send(200);
      });
    }
  };

};
