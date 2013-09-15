# Database Setup

These instructions were written specifically to work on Ubuntu, so if you
are on a different OS your mileage may vary.

The instructions assume you have installed postgresql in a standard way, which
includes creating a system user named postgres and a PostgreSQL superuser
also named postgres. It also assumes you have your PostgreSQL pg_hba.conf file
configured something like the example shown below--particularly allowing md5
password authentication for local unix socket users.

\# TYPE     DATABASE     USER     ADDRESS     METHOD
   local    all          postgres             peer
   local    all          all                  md5

For more info about this config file see: http://www.postgresql.org/docs/9.1/static/auth-pg-hba-conf.html

Assuming all that, you can run this sequence of commands to create a
PostgreSQL user named cuddlychang and a database of the same name owned by that
user. Then you can use the supplied schema.sql file to create the tables, etc
needed for this app.

```
sudo -u postgres createuser -SDRP cuddlychang
sudo -u postgres createdb -O cuddlychang cuddlychang
psql -U cuddlychang < schema.sql
```

There will be quite a few errors in the output if you are creating the tables for the
first time because the SQL is set up to drop existing tables and constraints and
re-create them, but these should be harmless.

Now you should be able to connect to the newly created database with

```
psql -U cuddlychang
```
