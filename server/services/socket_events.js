module.exports = function(io, poetsRepo) {
  
  io.sockets.on('connection', function(client) {
    client.on('joinPoem', function(poemId) {
      
      var poetId = client.handshake.user.id;
      poetsRepo.isPoetInPoem(poetId, poemId, function(err, poetInPoem) {
        if (err) { process.emit('error', err, 'SOCKET.IO ERROR'); }
        if (poetInPoem) {
          client.join('poem-' + poemId);
        }
      });

    });
  });

};