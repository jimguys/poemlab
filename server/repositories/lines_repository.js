var _ = require('underscore');

module.exports = function(db) {
  function mapLines(rows) {
    return _.map(rows, function(r) {
      return { id: r.id, poem: { id: r.poem_id }, poet: { id: r.poet_id, color: r.poet_id % 5 }, text: r.text };
    });
  }

  return {

    create: function(line, callback) {
      var sql = "insert into lines (poem_id, poet_id, text) values ($1, $2, $3) returning id";
      db.query(sql, [line.poem.id, line.poet.id, line.text], function(err, result) {
        if (err) { return callback(err); }
        var id = result.rows[0].id;
        callback(null, id);
      });
    },

    read: function(lineId, callback) {
      db.query("select * from lines where id = $1", [lineId], function(err, result) {
        if (err) { return callback(err); }
        callback(null, mapLines(result.rows)[0]);
      });
    },

    destroy: function(lineId, callback) {
      db.query("delete from lines where id = $1", [lineId], function(err) {
        callback(err);
      });
    },

    forPoem: function(poemId, callback) {
      db.query("select * from lines where poem_id = $1 order by id", [poemId], function(err, result) {
        if (err) { return callback(err); }
        callback(null, mapLines(result.rows));
      });
    }
  };
};
