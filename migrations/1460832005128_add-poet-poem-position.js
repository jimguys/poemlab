exports.up = function(db) {
  db.addColumns('poets_poems', { position: { type: 'int' }});
  db.sql('update poets_poems ' +
    'set position = v.position ' +
    'from ( ' +
    '	select (row_number() over(partition by poem_id))-1 as position, poem_id, poet_id ' +
    '	from poets_poems ' +
    '	where position is null ' +
    ') v ' +
    'where poets_poems.poet_id = v.poet_id ' +
    '  and poets_poems.poem_id = v.poem_id');
};

exports.down = function(db) {
  db.dropColumns('poets_poems', ['position']);
};
