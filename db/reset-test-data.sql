delete from lines where id in (select l.id from lines as l join poets as p on p.id = l.poet_id where p.username ilike 'test-%');
delete from poets_poems where poet_id in (select id from poets where username ilike 'test-%');
delete from poets where username ilike 'test-%';
