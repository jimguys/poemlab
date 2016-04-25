var _ = require('underscore');

module.exports = function linesRepository(db) {

  function mapLines(rows) {
    return _.map(rows, function(r) {
      return { id: r.id, poem: { id: r.poem_id }, poet: { id: r.poet_id, position: r.position }, text: r.text };
    });
  }

  return {

    create: function(line, callback) {
      var sql = "insert into lines (poem_id, poet_id, text) values ($1, $2, $3) returning id";
      db.query(sql, [line.poem.id, line.poet.id, line.text],
        function(err, result) {
          if (err) { return callback(err); }
          var id = result.rows[0].id;
          callback(null, id);
        });
    },

    update: function(line, callback) {
      var self = this;
      db.query("update lines set text = $1 where id = $2", [line.text, line.id],
        function(err, result) {
          if (err) { return callback(err); }
          self.read(line.id, callback);
        });
    },

    read: function(lineId, callback) {
      db.query("select l.id, l.poet_id, l.poem_id, l.text, pp.position from lines l " +
        "join poets_poems pp on pp.poet_id = l.poet_id and pp.poem_id = l.poem_id " +
        "where l.id = $1", [lineId],
        function(err, result) {
          if (err) { return callback(err); }
          callback(null, mapLines(result.rows)[0]);
        });
    },

    destroy: function(lineId, callback) {
      db.query("delete from lines where id = $1", [lineId],
        function(err) {
          callback(err);
        });
    },

    forPoem: function(poemId, callback) {
      db.query("select l.id, l.poet_id, l.poem_id, l.text, pp.position from lines l " +
        "join poets_poems pp on pp.poet_id = l.poet_id and pp.poem_id = l.poem_id " +
        "where l.poem_id = $1 order by id", [poemId],
        function(err, result) {
          if (err) { return callback(err); }
          callback(null, mapLines(result.rows));
        });
    }
  };
};
