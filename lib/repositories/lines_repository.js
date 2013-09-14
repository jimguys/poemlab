var repo = require('./common_repository');

module.exports = function(dbConfig) {

	return {
		create: function(line, callback) {
			repo.connect(dbConfig, callback, function(client, done) {
				var sql = "insert into lines (poem_id, poet_id, text) values ($1, $2, $3) returning id";
				client.query(sql, [line.poem_id, line.poet_id, line.text],
					repo.handleQueryResponse(callback, done, function(result) {
						var line = { id: result.rows[0].id,
							poem_id: line.poem_id,
							poet_id: line.poet_id,
							text: line.text
						};
						callback(null, line);
						done();
					})
				);
			});
		},

		read: function(line_id, callback) {
			repo.connect(dbConfig, callback, function(client, done) {
				client.query("select * from lines where id = $1", [line_id],
					repo.handleQueryResponse(callback, done, function(result) {
						callback(null, result.rows[0]);
						done();
					})
				);
			});
		},

		destroy: function(line_id, callback) {
			repo.connect(dbConfig, callback, function(client, done) {
				client.query("delete from lines where id = $1", [line_id],
					repo.handleQueryResponse(callback, done, function(result) {
						callback(null);
						done();
					})
				);
			});
		},

		forPoem: function(poem_id, callback) {
			repo.connect(dbConfig, callback, function(client, done) {
				client.query("select * from lines where poem_id = $1 order by id", [poem_id],
					repo.handleQueryResponse(callback, done, function(result) {
						callback(null, result.rows);
						done();
					})
				);
			});
		}
	};

};