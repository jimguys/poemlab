var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

module.exports = function(dbConfig) {
  var poetsRepo = require("../lib/repositories/poets_repository")(dbConfig);
  var authenticationService = require('../security/authentication_service')(poetsRepo);

  passport.use(new LocalStrategy({
      usernameField: 'username'
    },
    function(username, password, done) {
      authenticationService.verify(username, password, function(err, user) {
        done(err, user);
      });
    }
  ));

  passport.serializeUser(function(user, done) {
    done(null, user);
  });

  passport.deserializeUser(function(user, done) {
    global.user = user;
    done(null, user);
  });

  return {
    get: function(req, res) {
      res.render('login', { title: 'Poem Lab' });
    },

    login: function(req, res) {
      res.redirect('/poem');
    },

    logout: function(req, res) {
      request.logout();
      response.send(200);
    }
  }
}
