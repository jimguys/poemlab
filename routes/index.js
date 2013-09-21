var passport = require('passport');

module.exports = function(app, dbConfig) {
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(app.router);

  var login = require('./login')(dbConfig);
  var register = require('./register');
  var poem = require('./poem')(dbConfig);

  app.get('/', login.get);
  app.get('/login', login.get);
  app.post('/login', passport.authenticate('local'), login.login);
  app.del('/login', login.logout);

  app.get('/register', register.get);
  app.post('/register', register.post);

  app.get('/poem', poem.list);
  app.get('/poem/new', poem.createForm);
  app.get('/poem/:id', poem.edit);
  app.post('/poem', poem.create);

};
