exports.up = function(db) {
  db.alterColumn('poets', 'password', { type: 'varchar(64)' });
};

exports.down = function(db) {
  db.alterColumn('poets', 'password', { type: 'char(64)' });
};
