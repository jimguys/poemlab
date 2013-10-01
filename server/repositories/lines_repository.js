var _ = require('underscore');

module.exports = function(dbConfig) {
  var db = require('./poemlab_database')(dbConfig);

  return {

    create: function(line, callback) {
      var sql = "insert into lines (poem_id, poet_id, text) values ($1, $2, $3) returning id";
      db.query(sql, [line.poem_id, line.poet_id, line.text], function(err, result) {
        if (err) { return callback(err); }
        var createdLine = _.extend(line, { id: result.rows[0].id });
        callback(null, createdLine);
      });
    },

    read: function(line_id, callback) {
      db.query("select * from lines where id = $1", [line_id], function(err, result) {
        if (err) { return callback(err); }
        callback(null, result.rows[0]);
      });
    },

    destroy: function(line_id, callback) {
      db.query("delete from lines where id = $1", [line_id], function(err) {
        callback(err);
      });
    },

    forPoem: function(poem_id, callback) {
      db.query("select * from lines where poem_id = $1 order by id", [poem_id], function(err, result) {
        if (err) { return callback(err); }
        callback(null, result.rows);
      });
    }
  };
};
