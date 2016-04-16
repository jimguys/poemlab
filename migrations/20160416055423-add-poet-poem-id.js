var async = require('async');
var dbm = global.dbm || require('db-migrate');
var type = dbm.dataType;

exports.up = function(db, callback) {
  async.series([
    db.runSql('alter table public.poets_poems drop constraint poets_poems_pkey'),
    db.runSql('alter table public.poets_poems add column id serial primary key'),
  ], callback);
};

exports.down = function(db, callback) {
  callback();
};
