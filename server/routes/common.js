exports.respond = function(err, res, successCallback) {
  if (err) {
    console.error('***HANDLED ERROR: ' + err);
    res.send(500, 'Internal server error');
  } else {
    try {
      successCallback(res);
    }
    catch(ex) {
      console.error('***UNHANDLED EXCEPTION: ', ex.stack);
      res.send(500, 'Internal server error');
    }
  }
};
