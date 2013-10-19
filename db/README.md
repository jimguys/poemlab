# Database Setup

These instructions were written specifically to work on Ubuntu, so if you
are on a different OS your mileage may vary.

## PostgreSQL

The instructions assume you have installed postgresql in a standard way, which
includes creating a system user named postgres and a PostgreSQL superuser
also named postgres. It also assumes you have your PostgreSQL pg_hba.conf file
configured something like the example shown below--particularly allowing md5
password authentication for local unix socket users.

```
\# TYPE     DATABASE     USER     ADDRESS     METHOD
   local    all          postgres             peer
   local    all          all                  md5
```

For more info about this config file see: http://www.postgresql.org/docs/9.1/static/auth-pg-hba-conf.html

Assuming all that, you can run this sequence of commands to create a
PostgreSQL user named poemlab and a database of the same name owned by that
user. Then you can use the supplied schema.sql file to create the tables, etc
needed for this app.

```
sudo -u postgres createuser -SDRP poemlab
sudo -u postgres createdb -O poemlab poemlab
psql -U poemlab < schema.sql
```

There will be quite a few errors in the output if you are creating the tables for the
first time because the SQL is set up to drop existing tables and constraints and
re-create them, but these should be harmless.

Now you should be able to connect to the newly created database with

```
psql -U poemlab
```

## Migrations (db-migrate)

Once the database is created and the schema is loaded you will need to run all of
the migrations. We are using the db-migrate module for these. To get that setup, run:

```
sudo npm install -g db-migrate
sudo npm install -g pg
```

This will give you the db-migrate command globally and allow db-migrate to access the
pg module to interface with postgres.

Once you have that setup, cd into the `db` directory and copy `database.example.json`
to `database.json` and configure the params accordingly. Then, still in the `db` directory
run the following to run all pending migrations:

```
db-migrate up
```
