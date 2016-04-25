module.exports = function(io, poetsRepo) {

  io.sockets.on('connection', function(client) {
    client.on('joinPoem', function(poemId) {

      var poetId = client.handshake.user.id;
      poetsRepo.poetInPoem(poetId, poemId, function(err, isInPoem) {
        if (err) { process.emit('error', err, 'Error in joinPoem event'); }
        if (isInPoem) {
          client.join('poem-' + poemId);
        }
      });

    });
  });

};
