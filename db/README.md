# Database Setup

To create the database in PostgreSQL, run:

```
psql < schema.sql
```

This implies that you have PostgreSQL configured to trust the currently logged in user.
It will create the database using your username and will allow you to connect to it
without supplying a password. This is convenient for development.

If you want to create a separate user (pocolab in this example)for this database
(which is better for production), and if you are running Ubuntu or similar, here are
the steps to do it, assuming you've installed PostgreSQL in the "standard" way where
there is a PostgreSQL superuser named postgres and a system user called postgres and
peer authentication is configured, etc.

```
sudo -u postgres createuser -SDRP pocolab
sudo -u postgres createdb -O pocolab pocolab
psql -U pocolab < schema.sql
```

There will be quite a few errors in the output if you are creating the tables for the
first time because the SQL is set up to drop existing tables and constraints and
re-create them, but these should be harmless.

Now you should be able to connect to the newly created database with

```
psql -U pocolab
```

# Database Export

The schema.sql file can be created with this command, assuming certain configuration:

```
sudo -u postgres pg_dump -cOs pocolab > schema.sql
```
