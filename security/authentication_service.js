module.exports = function(poetsRepository) {
  return {

    verify: function(username, password, callback) {
      poetsRepository.readByUsername(username, function(err, user) {
        if (err) { return callback(err, null); }
        if (user.password === password) {
          callback(null, user);
        } else {
          callback('Invalid username or password', null);
        }
      });
    }

  };
};