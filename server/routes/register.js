var respond = require('./common').respond;
var passport = require('passport');

module.exports = function(dbConfig) {
  var poetsRepo = require("../repositories/poets_repository")(dbConfig);

  return {

    get: function(req, res) {
      res.render('register', { title: 'Poem Lab' });
    },

    create: function(req, res) {
      var userData = {
        username: req.body.username,
        email: req.body.email,
        password: req.body.hashedPassword
      };
      poetsRepo.create(userData, function(err, user) {
        respond(err, res, function() {
          passport.authenticate('local')(req, res, function() {
            res.redirect('/poem');
          });
        });
      });
    }
  };
};
