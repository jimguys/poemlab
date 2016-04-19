exports.up = function(pgm) {
  db.addColumns('poets_poems', { password_salt: { type: 'varchar(32)' }});
};

exports.down = function(pgm) {
  db.dropColumns('poets_poems', ['password_salt']);
};
