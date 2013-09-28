var _ = require('underscore');

module.exports = function(dbConfig) {
	var db = require('./poemlab_database')(dbConfig);

	return {
		create: function(user_data, callback) {
			var params = _.values(_.pick(user_data, ["username", "email", "password"]));
			db.query("insert into poets (name, email, password) values ($1, $2, $3) " +
					"returning id, name, email", params,
				function(err, result) {
					if (err) { return callback(err); }
					callback(null, result.rows[0]);
				}
			);
		},

		read: function(user_id, callback) {
			db.query("select * from poets where id = $1", [user_id], function(err, result) {
				if (err) { return callback(err); }
				callback(null, result.rows[0]);
			});
		},

		readByUsername: function(username, callback) {
			db.query("select * from poets where name = $1", [username], function(err, result) {
				if (err) { return callback(err); }
				callback(null, result.rows[0]);
			});
		},

		readByEmail: function(email, callback) {
			db.query("select * from poets where email = $1", [email], function(err, result) {
				if (err) { return callback(err); }
				callback(null, result.rows[0]);
			});
		},

		search: function(query, callback) {
			db.query("select * from poets where name ilike $1 limit 20", [query + "%"], function(err, result) {
				if (err) { return callback(err); }
				callback(null, result.rows);
			});
		},

		destroy: function(user_id, callback) {
			db.query("delete from poets where id = $1", [user_id], function(err, result) {
				callback(err);
			});
		},

		all: function(callback) {
			db.query("select * from poets", [], function(err, result) {
				if (err) { return callback(err); }
				callback(null, result.rows);
			});
		}
	};
};
