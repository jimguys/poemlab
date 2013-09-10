var dbConfig = require("../db/config.js");

var login = require('./login');
var register = require('./register');
var poem = require('./poem')(dbConfig);

module.exports = function(app) {

  app.get('/', login.get);
  app.get('/login', login.get);
  app.post('/login', login.post);

  app.get('/register', register.get);
  app.post('/register', register.post);

  app.get('/poem', poem.list);
  app.get('/poem/new', poem.createForm);
  app.get('/poem/:id', poem.edit);
  app.post('/poem', poem.create);

};
