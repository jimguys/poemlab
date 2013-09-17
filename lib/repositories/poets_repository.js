var _ = require('underscore');

module.exports = function(dbConfig) {

	var db = require('./poemlab_database')(dbConfig);

	return {

		create: function(user_data, callback) {
			var params = _.values(_.pick(user_data, ["name", "email", "password"]));
			db.query("insert into poets (name, email, password) values ($1, $2, $3) returning id", params,
				function(err, result) {
					if (err) { return callback(err); }
					var user = { id: result.rows[0].id };
					callback(null, user);
				}
			);
		},

		read: function(user_id, callback) {
			db.query("select * from poets where id = $1", [user_id], function(err, result) {
				if (err) { return callback(err); }
				callback(null, result.rows[0]);
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
