var passport = require('passport');

module.exports = function(app, io, dbConfig) {
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(app.router);

  var login = require('./login')(dbConfig);
  var register = require('./register')(dbConfig);
  var poem = require('./poem')(dbConfig);
  var poet = require('./poet')(dbConfig);
  var line = require('./line')(io, dbConfig);

  app.get('/', login.get);
  app.get('/login', login.get);
  app.post('/login', passport.authenticate('local'), login.login);
  app.get('/logout', login.logout);

  app.get('/register', register.get);
  app.post('/register', register.create);

  app.get('/poem', poem.list);
  app.get('/poem/new', poem.createForm);
  app.get('/poem/:id', poem.edit);
  app.post('/poem', poem.create);

  app.post('/line', line.create);

  app.get('/poet', poet.search);
};
