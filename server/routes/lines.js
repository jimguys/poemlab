var respond = require('./common').respond;

module.exports = function(db, io) {
  var lines = require("../repositories/lines")(db);
  
  return {
    create: function(req, res) {
      var line = {
        poet: { id: req.user.id, position: req.body.poetPosition },
        poem: { id: req.body.poemId },
        text: req.body.text
      };

      lines.create(line, function(err, id) {
        if (err) { return process.emit('error', err, 'SOCKET.IO ERROR'); }
        var eventName = 'line-created-for-poem-' + line.poem.id;
        line.id = id;
        io.sockets.in('poem-' + line.poem.id).emit(eventName, line);
        res.send(200);
      });
    }
  };

};
