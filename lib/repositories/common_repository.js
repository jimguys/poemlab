var postgres = require('pg');

exports.connect = function(dbConfig, completionCallback, successCallback) {
  postgres.connect(dbConfig, function(err, client, done) {
    if (err) {
      completionCallback(err, null);
      done();
    } else {
      successCallback(client, done);
    }
  });
};

exports.handleQueryResponse = function(completionCallback, done, successCallback) {
  return function(err, result) {
    if (err) {
      completionCallback(err, null);
      done();
    } else {
      successCallback(result);
    }
  }
};