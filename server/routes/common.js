exports.respond = function(err, res, successCallback) {
  if (err) {
    process.emit('error', err, 'HANDLED ERROR');
    res.send(500, 'Internal server error');
  } else {
    try {
      successCallback(res);
    }
    catch(ex) {
      process.emit('error', ex, 'UNHANDLED EXCEPTION');
      res.send(500, 'Internal server error');
    }
  }
};
