var repo = require('./common_repository');

function PoemsRepository(dbConfig) {
	this.dbConfig = dbConfig;
}

PoemsRepository.prototype.create = function create(poem_data, callback) {
	repo.connect(this.dbConfig, callback, function(client, done) {
		client.query("insert into poems (name) values ($1) returning id", [poem_data.name],
			repo.handleQueryResponse(callback, done, function(result) {
				var poem = { id: result.rows[0].id, name: poem_data.name };
				callback(null, poem);
				done();
			})
		);
	});
};


PoemsRepository.prototype.read = function read(poem_id, callback) {
	repo.connect(this.dbConfig, callback, function(client, done) {
		client.query("select * from poems where id = $1", [poem_id],
			repo.handleQueryResponse(callback, done, function(result) {
				callback(null, result.rows[0]);
				done();
			})
		);
	});
};

PoemsRepository.prototype.destroy = function destroy(poem_id, callback) {
	repo.connect(this.dbConfig, callback, function(client, done) {
		client.query("delete from poems where id = $1", [poem_id],
			repo.handleQueryResponse(callback, done, function(result) {
				callback(null);
				done();
			})
		);
	});
};

PoemsRepository.prototype.all = function all(callback) {
	repo.connect(this.dbConfig, callback, function(client, done) {
		client.query("select * from poems",
			repo.handleQueryResponse(callback, done, function(result) {
				callback(null, result.rows);
				done();
			})
		);
	});
};

module.exports = PoemsRepository;
