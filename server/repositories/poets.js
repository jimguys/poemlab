var _ = require('underscore');
var bcrypt = require('bcrypt');
const SALT_ROUNDS = 10;

module.exports = function poetsRepository(db) {

  function mapPoets(rows) {
    return _.map(rows, function(r) {
      return { id: r.id, username: r.username, email: r.email, password: r.password, position: r.position };
    });
  }

  function hashPassword(password, cb) {
    bcrypt.hash(password, SALT_ROUNDS, cb);
  }

  return {
    create: function(poet, callback) {
      hashPassword(poet.password, function(err, passwordHash) {
        if (err) { return callback(err); }

        db.query("insert into poets (username, email, password) values ($1, $2, $3) returning id",
            [poet.username, poet.email, passwordHash],
          function(err, result) {
            if (err) { return callback(err); }
            var id = result.rows[0].id;
            callback(null, id);
          }
        );
      });
    },

    changePassword: function(userId, password, callback) {
      hashPassword(password, function(err, passwordHash) {
        if (err) { return callback(err); }
        db.query("update poets set password = $1 where id = $2",
            [passwordHash, userId], callback);
      });
    },

    read: function(userId, callback) {
      db.query("select id, username, password from poets where id = $1", [userId], function(err, result) {
        if (err) { return callback(err); }
        callback(null, mapPoets(result.rows)[0]);
      });
    },

    readByUsername: function(username, callback) {
      db.query("select id, username, password from poets where username = $1", [username], function(err, result) {
        if (err) { return callback(err); }
        callback(null, mapPoets(result.rows)[0]);
      });
    },

    readByEmail: function(email, callback) {
      db.query("select id, username, password from poets where email = $1", [email], function(err, result) {
        if (err) { return callback(err); }
        callback(null, mapPoets(result.rows)[0]);
      });
    },

    forPoem: function(poemId, callback) {
      db.query("select p.id, p.username, pp.position from poets as p inner join poets_poems as pp " +
        "on p.id = pp.poet_id where pp.poem_id = $1 order by pp.position", [poemId],
        function(err, result) {
          if(err) { return callback(err); }
          callback(null, mapPoets(result.rows));
        }
      );
    },

    search: function(query, callback) {
      db.query("select id, username from poets where username ilike $1 limit 20", [query + "%"], function(err, result) {
        if (err) { return callback(err); }
        callback(null, mapPoets(result.rows));
      });
    },

    destroy: function(userId, callback) {
      db.query("delete from poets where id = $1", [userId], function(err, result) {
        callback(err);
      });
    },

    all: function(callback) {
      db.query("select poet_id, username from poets", [], function(err, result) {
        if (err) { return callback(err); }
        callback(null, mapPoets(result.rows));
      });
    },

    poetInPoem: function(poetId, poemId, callback) {
      db.query("select 1 from poets_poems where poem_id = $1 and poet_id = $2", [poemId, poetId],
        function(err, result) {
          if (err) { return callback(err); }
          callback(null, result.rows.length > 0);
        }
      );
    },

    poetHasLine: function(poetId, lineId, callback) {
      db.query("select 1 from lines where id = $1 and poet_id = $2", [lineId, poetId],
        function(err, result) {
          if (err) { return callback(err); }
          callback(null, result.rows.length > 0);
        }
      );
    }
  };
};
