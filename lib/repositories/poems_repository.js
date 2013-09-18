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
		}
	};
};
