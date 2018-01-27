var passport = require('passport');
var middleware = require('./middleware.js');

module.exports = function(app, db, redis, io, mailerTransport) {
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(middleware.redirectBasedOnLoggedInStatus);
  app.use(app.router);

  var poetsRepo = require('../repositories/poets')(db);
  var auth = require('../services/authentication')(poetsRepo);
  var resetService = require('../services/password-reset')(poetsRepo, redis, mailerTransport);

  var login = require('./login')(db);
  var register = require('./register')(db);
  var reset = require('./reset')(resetService);

  app.get('/', login.get);
  app.get('/login', login.get);
  app.post('/login', login.login);
  app.get('/logout', login.logout);

  app.get('/reset', reset.get);
  app.post('/reset', reset.post);
  app.get('/reset/:token', reset.reset);
  app.post('/change', reset.change);

  app.get('/register', register.get);
  app.post('/register', register.create);
};
