var dbm = require('db-migrate');
var type = dbm.dataType;

exports.up = function(db, callback) {
  db.renameColumn('poets', 'name', 'username', callback);
};

exports.down = function(db, callback) {
  db.renameColumn('poets', 'username', 'name', callback);
};
