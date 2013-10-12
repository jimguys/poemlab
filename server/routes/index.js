var passport = require('passport');
var middleware = require('./middleware.js');

module.exports = function(app, io, dbConfig) {
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(middleware.redirectBasedOnLoggedInStatus);
  app.use(app.router);

  var poetsRepo = require('../repositories/poets_repository')(dbConfig);
  var auth = require('../services/authentication_service')(poetsRepo);

  var login = require('./login')(dbConfig);
  var register = require('./register')(dbConfig);
  var poem = require('./poem')(dbConfig);
  var poet = require('./poet')(dbConfig);
  var line = require('./line')(io, dbConfig);

  app.get('/', login.get);
  app.get('/login', login.get);
  app.post('/login', login.login);
  app.get('/logout', login.logout);

  app.get('/register', register.get);
  app.post('/register', register.create);

  app.get('/poem', poem.list);
  app.get('/poem/new', poem.createForm);
  app.get('/poem/:id', auth.verifyPoetAccess('id'), poem.edit);
  app.post('/poem', poem.create);

  app.post('/line', auth.verifyPoetAccess('poemId'), line.create);

  app.get('/poet', poet.search);
};
