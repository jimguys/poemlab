var config = require("./config.js");

var express = require('express');
var http = require('http');
var path = require('path');

var app = express();
var server = http.createServer(app);
var io = require('socket.io').listen(server);
io.set('log level', 1);

// all environments
app.set('port', process.env.PORT || 80);
app.set('views', __dirname + '/server/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.cookieParser());
app.use(express.session({ secret: config.security.sessionKey }));
app.use(express.methodOverride());
app.use(express.static(path.join(__dirname, 'public')));

// route registration
require('./server/routes')(app, io, config.db);

// error handler
app.use(function(err, req, res, next) {
  console.error('***UNHANDLED ERROR: ', err.stack);
  res.send(500, 'Internal server error');
});

// start the http server
server.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
