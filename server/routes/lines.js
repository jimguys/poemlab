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
        if (err) {
          process.emit('error', err, 'Error in POST /edit');
          return res.send(500, err);
        }
        line.id = id;
        var eventName = 'line-created-for-poem-' + line.poem.id;
        io.sockets.in('poem-' + line.poem.id).emit(eventName, line);
        res.send(200);
      });
    },

    edit: function(req, res) {
      lines.read(req.params.id, function(err, line) {
        if (err) {
          process.emit('error', err, 'Error in POST /edit/:id');
          return res.send(500, err);
        }
        if (line === undefined) { return res.send(404); }
        line.text = req.body.value;
        lines.update(line, function(err, line) {
          if (err) {
            process.emit('error', err, 'Error in POST /edit/:id');
            return res.send(500, err);
          }
          var eventName = 'line-edited-for-poem-' + line.poem.id;
          io.sockets.in('poem-' + line.poem.id).emit(eventName, line);
          res.send(200);
        });
      });
    }
  };

};
