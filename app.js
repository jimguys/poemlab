var config = require("./config.js");

var express = require('express');
var http = require('http');
var path = require('path');
var jadeBrowser = require('jade-browser');
var passportSocketIo = require("passport.socketio");

var app = express();
var server = http.createServer(app);
var io = require('socket.io').listen(server);
io.set('log level', 1);
var sessionStore = new express.session.MemoryStore();

// all environments
app.set('port', process.env.PORT || 80);
app.set('views', __dirname + '/server/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.cookieParser());
app.use(express.session({ store: sessionStore, secret: config.security.sessionKey }));
app.use(express.methodOverride());
app.use(express.static(path.join(__dirname, 'public')));
app.use(jadeBrowser('/js/partials.js', '/server/views/partials/**', { root: __dirname }));

// route registration
require('./server/routes')(app, io, config.db);

// socket.io functionality
require('./server/services/socket-events')(io,
  require('./server/repositories/poets_repository')(config.db));

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
  console.log('Express server listening on port ' + app.get('port'));
});

io.set('authorization', passportSocketIo.authorize({
  cookieParser: express.cookieParser,
  key: 'connect.sid',
  secret: config.security.sessionKey,
  store: sessionStore,
  fail: function(data, accept) {
    accept(null, false);
  },
  success: function(data, accept) {
    accept(null, true);
  }
}));
