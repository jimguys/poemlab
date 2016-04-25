var _ = require('underscore');
var bcrypt = require('bcrypt');
var crypto = require('crypto');

module.exports = function authenticationService(poetsRepository) {

  return {

    verifyCredentials: function(username, password, callback) {
      poetsRepository.readByUsername(username, function(err, user) {
        if (err) { return callback(err, null); }
        const message = 'Invalid username or password';
        if (user === undefined)
          return callback(null, false, { message: message });

        checkPassword(password, user.password, function(err, valid) {
          if (err) { return callback(err, null)};
          callback(err, valid ? user : null, valid ? null : { message: message });
        });
      });
    },

    verifyPoetPoemAccess: function(poemIdFunction) {
      return function(req, res, next) {
        var poetId = req.user.id;
        var poemId = poemIdFunction(req);

        poetsRepository.poetInPoem(poetId, poemId, function(err, isInPoem) {
          if (err) { return next(err); }
          if (!isInPoem) { return res.send(403); }
          next();
        });
      };
    },

    verifyPoetLineAccess: function(lineIdFunction) {
      return function(req, res, next) {
        var poetId = req.user.id;
        var lineId = lineIdFunction(req);

        poetsRepository.poetHasLine(poetId, lineId, function(err, hasLine) {
          if (err) { return next(err); }
          if (!hasLine) { return res.send(403); }
          next();
        });
      };
    }
  };

  function checkPassword(password, hash, callback) {
    if (hash.startsWith('$2')) {
      bcrypt.compare(password, hash, function(err, valid) {
        callback(null, valid);
      });
    } else {
      // old password hashing
      callback(null, hash === crypto.createHash('sha256').update('password').digest('hex'));
    }
  }
};
