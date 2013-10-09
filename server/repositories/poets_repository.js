var _ = require('underscore');

module.exports = function(dbConfig) {
  var db = require('./poemlab_database')(dbConfig);

  function mapPoets(rows) {
    return _.map(rows, function(r) {
      return { id: r.id, name: r.name, email: r.email, password: r.password };
    });
  }

  return {
    create: function(userData, callback) {
      var params = _.values(_.pick(userData, ["username", "email", "password"]));
      db.query("insert into poets (name, email, password) values ($1, $2, $3) " +
          "returning id, name, email", params,
        function(err, result) {
          if (err) { return callback(err); }
          callback(null, mapPoets(result.rows)[0]);
        }
      );
    },

    read: function(userId, callback) {
      db.query("select * from poets where id = $1", [userId], function(err, result) {
        if (err) { return callback(err); }
        callback(null, mapPoets(result.rows)[0]);
      });
    },

    readByUsername: function(username, callback) {
      db.query("select * from poets where name = $1", [username], function(err, result) {
        if (err) { return callback(err); }
        callback(null, mapPoets(result.rows)[0]);
      });
    },

    readByEmail: function(email, callback) {
      db.query("select * from poets where email = $1", [email], function(err, result) {
        if (err) { return callback(err); }
        callback(null, mapPoets(result.rows)[0]);
      });
    },

    forPoem: function(poemId, callback) {
      db.query("select p.* from poets as p inner join poets_poems as pp " +
        "on p.id = pp.poet_id where pp.poem_id = $1", [poemId],
        function(err, result) {
          if(err) { return callback(err); }
          callback(null, mapPoets(result.rows));
        }
      );
    },

    search: function(query, callback) {
      db.query("select * from poets where name ilike $1 limit 20", [query + "%"], function(err, result) {
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
      db.query("select * from poets", [], function(err, result) {
        if (err) { return callback(err); }
        callback(null, mapPoets(result.rows));
      });
    }
  };
};
