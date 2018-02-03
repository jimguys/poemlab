var express = require('express');
var http = require('http');
var path = require('path');
var passportSocketIo = require("passport.socketio");
var nodemailer = require('nodemailer');
var expressSession = require('express-session');
var RedisStore = require('connect-redis')(expressSession);
var redis = require('redis').createClient(process.env.REDIS_URL) ;
var logger = require('morgan');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var methodOverride = require('method-override');
var errorHandler = require('errorhandler');

var app = express();
var server = http.createServer(app);
var io = require('socket.io').listen(server);
var db = require('./db.js')(process.env.DATABASE_URL);
var sessionStore = new RedisStore({ url: process.env.REDIS_URL });
var sessionKey = process.env.SESSION_KEY;
var mailerTransport = nodemailer.createTransport(process.env.EMAIL_SMTP_TRANSPORT === 'mock'
  ? global.mockMailerTransport = require('nodemailer-mock-transport')()
  : process.env.EMAIL_SMTP_TRANSPORT);

io.set('log level', 1);

app.set('port', process.env.PORT || 8088);
app.set('views', path.join(__dirname, 'server/views'));
app.set('view engine', 'pug');
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(expressSession({ store: sessionStore, secret: sessionKey,
  resave: false, saveUninitialized: true }));
app.use(methodOverride());
app.use(express.static(path.join(__dirname, 'public')));
app.use(errorHandler({ dumpExceptions: true, showStack: true }));

// route registration
require('./server/routes')(app, db, redis, io, mailerTransport);

// socket.io functionality
require('./server/services/socket-events')(io,
  require('./server/repositories/poets')(db));

// error handler
app.use(function(err, req, res, next) {
  process.emit('error', err, 'UNHANDLED ERROR');
  res.send(500, 'Internal server error');
});

process.on('error', function(err, category) {
  console.error('***' + category || 'ERROR' + ': ', err.stack);
});

// start the http server
server.listen(app.get('port'), function(){
  var port = app.get('port');
  console.log('Express server listening on port ' + port);
  process.emit('ready', port);
});

io.set('authorization', passportSocketIo.authorize({
  cookieParser: cookieParser,
  key: 'connect.sid',
  secret: sessionKey,
  store: sessionStore,
  fail: function(data, accept) {
    accept(null, false);
  },
  success: function(data, accept) {
    accept(null, true);
  }
}));
