module.exports = function(io, poetsRepo) {
  
  io.sockets.on('connection', function(client) {
    client.on('joinPoem', function(poemId) {
      
      var poetId = client.handshake.user.id;
      poetsRepo.isPoetInPoem(poetId, poemId, function(err, contains) {
        if (err) { process.emit('error', err, 'SOCKET.IO ERROR'); }
        if (contains) {
          client.join('poem-' + poemId);
        }
      });

    });
  });

};