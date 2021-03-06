module.exports = function poetValidator(poetsRepository) {

  function isDuplicateUsername(username, callback) {
    poetsRepository.readByUsername(username, function(err, user) {
      var isDuplicate = !!user;
      callback(isDuplicate);
    });
  }

  function isDuplicateEmail(email, callback) {
    poetsRepository.readByEmail(email, function(err, user) {
      var isDuplicate = !!user;
      callback(isDuplicate);
    });
  }

  function emailLooksValid(email) {
    var basicEmailRegex = /\S+@\S+\.\S+/;
    return email && basicEmailRegex.test(email);
  }

  return {

    emailLooksValid: emailLooksValid,

    validate: function(poet, callback) {

      var valid;
      var errors = [];

      if (!poet.username) { errors.push("A username is required"); }
      if (!poet.email) { errors.push("An email address is required"); }
      if (!poet.password) { errors.push("A password is required"); }

      if (!emailLooksValid(poet.email)) {
        errors.push("The email address supplied doesn't look valid");
      }

      if (errors.length > 0) {
        valid = false;
        return callback(valid, errors);
      }

      isDuplicateUsername(poet.username, function(duplicateUsername) {
        isDuplicateEmail(poet.email, function(duplicateEmail) {
          if (duplicateUsername) { errors.push("That username has already been taken"); }
          if (duplicateEmail) { errors.push("That email has already been taken"); }
          valid = errors.length === 0;
          callback(valid, errors);
        });
      });

    }

  };

};
