module.exports = function(dbConfig) {
	var repo = require('./common_repository')(dbConfig);

	return {
		create: function(line, callback) {
			var sql = "insert into lines (poem_id, poet_id, text) values ($1, $2, $3) returning id";
			repo.query(sql, [line.poem_id, line.poet_id, line.text], function(err, result, done) {
				if (err) { return callback(err); }
				var line = { id: result.rows[0].id,
					poem_id: line.poem_id,
					poet_id: line.poet_id,
					text: line.text
				};
				callback(null, line);
			});
		},

		read: function(line_id, callback) {
			repo.query("select * from lines where id = $1", [line_id], function(err, result) {
				if (err) { return callback(err); }
				callback(null, result.rows[0]);
			});
		},

		destroy: function(line_id, callback) {
			repo.query("delete from lines where id = $1", [line_id], function(err) {
				callback(err);
			});
		},

		forPoem: function(poem_id, callback) {
			repo.query("select * from lines where poem_id = $1 order by id", [poem_id], function(err, result) {
				if (err) { return callback(err); }
				callback(null, result.rows);
			});
		}
	};
};