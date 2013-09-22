module.exports = function(io, dbConfig) {

  var linesRepo = require("./repositories/lines_repository")(dbConfig);

  io.sockets.on('connection', function (socket) {
    socket.on('line-submitted', function (lineData) {
      linesRepo.create(lineData, function(err, poemLine) {
        if (err) {
          return console.error('***SOCKET.IO ERROR: ' + err);
        }
        socket.emit('line-created', poemLine);
        socket.broadcast.emit('line-created', poemLine);
      });
    });
  });
};
