var passport = require('passport');
var middleware = require('./middleware.js');

module.exports = function(app, io, dbConfig) {
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(middleware.redirectBasedOnLoggedInStatus);
  app.use(app.router);

  var login = require('./login')(dbConfig);
  var register = require('./register')(dbConfig);
  var poems = require('./poems')(dbConfig);
  var poets = require('./poets')(dbConfig);
  var lines = require('./lines')(io, dbConfig);

  app.get('/', login.get);
  app.get('/login', login.get);
  app.post('/login', login.login);
  app.get('/logout', login.logout);

  app.get('/register', register.get);
  app.post('/register', register.create);

  app.get('/poems', poems.list);
  app.get('/poems/new', poems.createForm);
  app.get('/poems/:id', poems.edit);
  app.post('/poems', poems.create);

  app.post('/lines', lines.create);

  app.get('/poets', poets.search);
};
