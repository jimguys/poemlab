var pg = require('pg');

function PoemsRepository(dbConfig) {
	this.dbConfig = dbConfig || {
		database: "pocolab",
		host: "localhost"
	};
}

PoemsRepository.prototype.create = function create(poem_data, callback) {
	pg.connect(this.dbConfig, function(err, client, done) {
		client.query("insert into poems (name) values ($1) returning id", [poem_data.name], function(err, result) {
			var poem = { id: result.rows[0].id, name: poem_data.name };
			callback(err, poem);
			done();
		});
	});
};

PoemsRepository.prototype.read = function read(poem_id, callback) {
	pg.connect(this.dbConfig, function(err, client, done) {
		client.query("select * from poems where id = $1", poem_id, function(err, result) {
			callback(err, result.rows[0]);
			done();
		});
	});
};

PoemsRepository.prototype.destroy = function destroy(poem_id, callback) {
	pg.connect(this.dbConfig, function(err, client, done) {
		client.query("delete from poems where id = $1", poem_id, function(err, result) {
			callback(err);
			done();
		});
	});
};

PoemsRepository.prototype.all = function all(callback) {
	pg.connect(this.dbConfig, function(err, client, done) {
		client.query("select * from poems", function(err, result) {
			callback(err, result.rows);
			done();
		});
	});
};

module.exports = PoemsRepository;
