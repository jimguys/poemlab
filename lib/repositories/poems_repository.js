module.exports = function(dbConfig) {
	var db = require('./poemlab_database')(dbConfig);

	return {

		create: function(poem_data, callback) {
			db.query("insert into poems (name) values ($1) returning id", [poem_data.name], function(err, result) {
				if (err) { return callback(err); }
				var poem = { id: result.rows[0].id, name: poem_data.name };
				callback(null, poem);
			});
		},

		addPoet: function(poem_id, poet_id, callback) {
			db.query("insert into poets_poems (poem_id, poet_id) values ($1, $2)", [poem_id, poet_id],
				function(err, result) {
					callback(err);
				}
			);
		},

		removePoet: function(poem_id, poet_id, callback) {
			db.query("delete from poets_poems where poem_id = $1 and poet_id = $2", [poem_id, poet_id],
				function(err, result) {
					callback(err);
				}
			);
		},

		getPoets: function(poem_id, callback) {
			db.query("select p.* from poets as p inner join poets_poems as pp " +
				"on p.id = pp.poet_id where pp.poem_id = $1", [poem_id],
				function(err, result) {
					if(err) { return callback(err); }
					callback(null, result.rows);
				}
			);
		},

		read: function(poem_id, callback) {
			db.query("select * from poems where id = $1", [poem_id], function(err, result) {
				if (err) { return callback(err); }
				callback(null, result.rows[0]);
			});
		},

		destroy: function(poem_id, callback) {
			db.query("delete from poems where id = $1", [poem_id], function(err, result) {
				callback(err);
			});
		},

		all: function(callback) {
			db.query("select * from poems", [], function(err, result) {
				if (err) { return callback(err); }
				callback(null, result.rows);
			});
		},

		forPoet: function(poet_id, callback) {
			db.query("select p.* from poems p inner join poets_poems as pp " +
				"on p.id = pp.poem_id where pp.poet_id = $1", [poet_id],
				function(err, result) {
					if(err) { return callback(err); }
					callback(null, result.rows);
				}
			);
		}
	};
};
