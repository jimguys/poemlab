var respond = require('./common').respond;
var passport = require('passport');

module.exports = function(db) {
  var poetsRepo = require("../repositories/poets")(db);
  var poetValidator = require('../services/poet-validator')(poetsRepo);

 return {

    get: function(req, res) {
      res.render('register', { title: 'Poemlab', user: {} });
    },

    create: function(req, res) {
      var user = {
        username: req.body.username,
        email: req.body.email,
        password: req.body.password
      };

      poetValidator.validate(user, function(valid, errors) {
        if(errors.length > 0) {
          return res.render('register', { title: 'Poemlab', user: user, errors: errors });
        }

        poetsRepo.create(user, function(err, id) {
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
