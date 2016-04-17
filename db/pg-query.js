var pg = require('pg');
var fs = require('fs');

function exec(connectionString, file, callback) {
  pg.connect(connectionString, function(err, client, done) {
    if (err) { return callback(err); }
    var sql = fs.readFileSync(file, {encoding: 'utf-8'});
    console.log(sql);
    client.query(sql, [], function(err, result) {
      done();
      callback(err, result);
    });
  });
}

exec(process.env.DATABASE_URL, process.argv[2], function(err, result) {
  if (err) {
    console.log(err);
    process.exit(1);
  }
  console.log(result);
  process.exit(0);
});
