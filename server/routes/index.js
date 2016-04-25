var passport = require('passport');
var middleware = require('./middleware.js');

module.exports = function(app, db, io) {
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(middleware.redirectBasedOnLoggedInStatus);
  app.use(app.router);

  var poetsRepo = require('../repositories/poets')(db);
  var auth = require('../services/authentication')(poetsRepo);

  var login = require('./login')(db);
  var register = require('./register')(db);
  var poems = require('./poems')(db);
  var poets = require('./poets')(db);
  var lines = require('./lines')(db, io);

  app.get('/', login.get);
  app.get('/login', login.get);
  app.post('/login', login.login);
  app.get('/logout', login.logout);

  app.get('/register', register.get);
  app.post('/register', register.create);

  app.get('/poems', poems.list);
  app.get('/poems/new', poems.createForm);
  app.get('/poems/:id', auth.verifyPoetPoemAccess(function(req){ return req.params.id; }), poems.edit);
  app.post('/poems', poems.create);

  app.post('/lines', auth.verifyPoetPoemAccess(function(req) { return req.body.poemId; }), lines.create);
  app.post('/lines/:id', auth.verifyPoetLineAccess(function(req) { return req.body.pk; }), lines.edit);

  app.get('/poets', poets.search);
};
