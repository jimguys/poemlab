var _ = require('underscore');
var bcrypt = require('bcrypt');
var crypto = require('crypto');

module.exports = function authenticationService(poetsRepository) {

  return {

    verifyCredentials: function(username, password, callback) {
      poetsRepository.readByUsername(username, function(err, user) {
        if (err) { return callback(err, null); }
        if (user === undefined)
          return callback(null, false);

        checkPassword(password, user.password, function(err, valid) {
          callback(err, valid ? user : null, valid ? null : { message: 'Invalid username or password' });
        });
      });
    },

    verifyPoetAccess: function(poemIdFunction) {
      return function(req, res, next) {
        var poetId = req.user.id;
        var poemId = poemIdFunction(req);

        poetsRepository.isPoetInPoem(poetId, poemId, function(err, isInPoem) {
          if (err) { return next(err); }
          if (!isInPoem) { return res.send(403, 'not in poem: ' + poetId + ',' + poemId); }
          next();
        });
      };
    }
  };

  function checkPassword(password, hash, callback) {
    if (hash.startsWith('$2')) {
      bcrypt.compare(password, hash, callback);
    } else {
      // old password hashing
      callback(null, hash === crypto.createHash('sha256').update('password').digest('hex'));
    }
  }
};
