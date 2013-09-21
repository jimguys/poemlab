var respond = require('./common').respond;

module.exports = function(dbConfig) {
  var poetsRepo = require("../lib/repositories/poets_repository")(dbConfig);

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
          res.redirect('/poem');
        });
      });
    }
  };
};
