var _ = require('underscore');

module.exports = function authenticationService(poetsRepository) {

  return {

    verifyCredentials: function(username, password, callback) {
      poetsRepository.readByUsername(username, function(err, user) {
        if (err) { return callback(err, null); }
        if (user !== undefined && user.password === password) {
          callback(null, user);
        } else {
          callback(null, null, { message: 'Invalid username or password' });
        }
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
};
