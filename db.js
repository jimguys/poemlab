var pg = require('pg');

module.exports = function(connectionString) {

  return {
    query: function(sql, parameters, callback) {
      pg.Pool({connectionString: connectionString}).connect(function(err, client, done) {
        if (err) { return callback(err); }
        client.query(sql, parameters, function(err, result) {
          done();
          callback(err, result);
        });
      });
    }
  };
};

