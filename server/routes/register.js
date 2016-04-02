var respond = require('./common').respond;
var passport = require('passport');

module.exports = function(db) {
  var poetsRepo = require("../repositories/poets_repository")(db);
  var poetValidator = require('../services/poet_validator')(poetsRepo);

 return {

    get: function(req, res) {
      res.render('register', { title: 'Poem Lab', user: {} } );
    },

    create: function(req, res) {
      var userData = {
        username: req.body.username,
        email: req.body.email,
        password: req.body.hashedPassword
      };

      poetValidator.validate(userData, function(valid, errors) {
        if(errors.length > 0) {
          return res.render('register', { title: 'Poem Lab', user: userData, errors: errors });
        }

        poetsRepo.create(userData, function(err, user) {
          respond(err, res, function() {
            passport.authenticate('local')(req, res, function() {
              res.redirect('/poems');
            });
          });
        });

      });

    }
  };
};
