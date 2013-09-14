var repo = require('./common_repository');

module.exports = function(dbConfig) {

	return {

		create: function(poem_data, callback) {
			repo.connect(dbConfig, callback, function(client, done) {
				client.query("insert into poems (name) values ($1) returning id", [poem_data.name],
					repo.handleQueryResponse(callback, done, function(result) {
						var poem = { id: result.rows[0].id, name: poem_data.name };
						callback(null, poem);
						done();
					})
				);
			});
		},

		read: function(poem_id, callback) {
			repo.connect(dbConfig, callback, function(client, done) {
				client.query("select * from poems where id = $1", [poem_id],
					repo.handleQueryResponse(callback, done, function(result) {
						callback(null, result.rows[0]);
						done();
					})
				);
			});
		},

		destroy: function(poem_id, callback) {
			repo.connect(dbConfig, callback, function(client, done) {
				client.query("delete from poems where id = $1", [poem_id],
					repo.handleQueryResponse(callback, done, function(result) {
						callback(null);
						done();
					})
				);
			});
		},

		all: function(callback) {
			repo.connect(dbConfig, callback, function(client, done) {
				client.query("select * from poems",
					repo.handleQueryResponse(callback, done, function(result) {
						callback(null, result.rows);
						done();
					})
				);
			});
		}

	};
};