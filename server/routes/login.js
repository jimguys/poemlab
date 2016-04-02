var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

module.exports = function(db) {
  var poetsRepo = require("../repositories/poets_repository")(db);
  var authenticationService = require('../services/authentication_service')(poetsRepo);

  passport.use(new LocalStrategy({
      usernameField: 'username',
      passwordField: 'hashedPassword'
    },
    function(username, password, done) {
      authenticationService.verifyCredentials(username, password, function(err, user, info) {
        done(err, user, info);
      });
    }
  ));

  passport.serializeUser(function(user, done) {
    done(null, user);
  });

  passport.deserializeUser(function(user, done) {
    done(null, user);
  });

  return {
    get: function(req, res) {
      res.render('login', { title: 'Poem Lab' });
    },

    login: function(req, res, next) {
      passport.authenticate('local', function(err, user, info) {
        if (err) { return next(err); }
        if (!user) {
          return res.render('login', { title: 'Poem Lab', errors: [ info.message ] });
        }
        req.login(user, function(err) {
          if (err) { return next(err); }
          res.redirect('/poems');
        });
      })(req, res, next);
    },

    logout: function(req, res) {
      req.logout();
      res.redirect('/');
    }
  };
};
