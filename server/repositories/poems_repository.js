var _ = require('underscore');

module.exports = function(db) {
  function mapPoems(rows) {
    return _.map(rows, function(r) {
      return { id: r.id, name: r.name };
    });
  }

  return {

    create: function(poem, callback) {
      db.query("insert into poems (name) values ($1) returning id", [poem.name], function(err, result) {
        if (err) { return callback(err); }
        var id = result.rows[0].id;
        callback(null, id);
      });
    },

    addPoet: function(poemId, poetId, callback) {
      db.query("insert into poets_poems (poem_id, poet_id) values ($1, $2)", [poemId, poetId],
        function(err, result) {
          callback(err);
        }
      );
    },

    addPoets: function(poemId, poetIds, callback) {
      db.query("insert into poets_poems (poem_id, poet_id) select $1, id from poets p " +
        "where p.id = any($2::int[])", [poemId, poetIds],
        function(err, result) {
          callback(err);
        }
      );
    },

    removePoet: function(poemId, poetId, callback) {
      db.query("delete from poets_poems where poem_id = $1 and poet_id = $2", [poemId, poetId],
        function(err, result) {
          callback(err);
        }
      );
    },

    read: function(poemId, callback) {
      db.query("select * from poems where id = $1", [poemId], function(err, result) {
        if (err) { return callback(err); }
        callback(null, mapPoems(result.rows)[0]);
      });
    },

    destroy: function(poemId, callback) {
      db.query("delete from poems where id = $1", [poemId], function(err, result) {
        callback(err);
      });
    },

    all: function(callback) {
      db.query("select * from poems", [], function(err, result) {
        if (err) { return callback(err); }
        callback(null, mapPoems(result.rows));
      });
    },

    forPoet: function(poetId, callback) {
      db.query("select p.* from poems p inner join poets_poems as pp " +
        "on p.id = pp.poem_id where pp.poet_id = $1", [poetId],
        function(err, result) {
          if(err) { return callback(err); }
          callback(null, mapPoems(result.rows));
        }
      );
    }

  };
};
