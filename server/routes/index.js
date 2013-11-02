var passport = require('passport');
var middleware = require('./middleware.js');

module.exports = function(app, io, dbConfig, poemRegistry) {
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(middleware.redirectBasedOnLoggedInStatus);
  app.use(app.router);

  var poetsRepo = require('../repositories/poets_repository')(dbConfig);
  var auth = require('../services/authentication_service')(poetsRepo);

  var login = require('./login')(dbConfig);
  var register = require('./register')(dbConfig);
  var poems = require('./poems')(dbConfig, poemRegistry);
  var poets = require('./poets')(dbConfig);
  var lines = require('./lines')(io, dbConfig, poemRegistry);

  app.get('/', login.get);
  app.get('/login', login.get);
  app.post('/login', login.login);
  app.get('/logout', login.logout);

  app.get('/register', register.get);
  app.post('/register', register.create);

  app.get('/poems', poems.list);
  app.get('/poems/new', poems.createForm);
  app.get('/poems/:id', auth.verifyPoetAccess({ poemIdField: 'id' }), poems.edit);
  app.post('/poems', poems.create);

  app.post('/lines', auth.verifyPoetAccess({ poemIdField: 'poemId' }), lines.create);

  app.get('/poets', poets.search);
};
