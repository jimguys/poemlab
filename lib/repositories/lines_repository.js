var pg = require('pg');

function LinesRepository(dbConfig) {
	this.dbConfig = dbConfig;
}

LinesRepository.prototype.create = function create(line, callback) {
	pg.connect(this.dbConfig, function(err, client, done) {
		var sql = "insert into lines (poem_id, poet_id, text) values ($1, $2, $3) returning id";
		client.query(sql, [line.poem_id, line.poet_id, line.text], function(err, result) {
			var line = { id: result.rows[0].id,
				poem_id: line.poem_id,
				poet_id: line.poet_id,
				text: line.text
			};
			callback(err, line);
			done();
		});
	});
};

LinesRepository.prototype.read = function read(line_id, callback) {
	pg.connect(this.dbConfig, function(err, client, done) {
		client.query("select * from lines where id = $1", [line_id], function(err, result) {
			callback(err, result.rows[0]);
			done();
		});
	});
};

LinesRepository.prototype.destroy = function destroy(line_id, callback) {
	pg.connect(this.dbConfig, function(err, client, done) {
		client.query("delete from lines where id = $1", [line_id], function(err, result) {
			callback(err);
			done();
		});
	});
};

LinesRepository.prototype.forPoem = function forPoem(poem_id, callback) {
	pg.connect(this.dbConfig, function(err, client, done) {
		client.query("select * from lines where poem_id = $1 order by id", [poem_id], function(err, result) {
			callback(err, result.rows);
			done();
		});
	});
};

module.exports = LinesRepository;
