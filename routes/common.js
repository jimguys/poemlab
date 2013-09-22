exports.respond = function(err, res, successCallback) {
  if (err) {
    console.error('***ERROR: ' + err);
    res.send(500, 'Internal server error');
  } else {
    successCallback(res);
  }
};
