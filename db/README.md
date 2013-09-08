To create the database in Postgresql, run:

```
psql < schema.sql
```

This implies that you have Postgresql configured to trust the currently logged in user.
It will create the database using your username and will allow you to connect to it
without supplying a password. This is convenient for development.

If you do not have it configured this way, or want to create the database using a
different username and password, you should supply those credentials to psql. The user
you specify will have to have been set up in Postgres already.

I haven't tested it, but I think this is how you would do it:

```
psql -U <username> -W < schema.sql
```

The -U flag allows you to specify the user and the -W flag forces psql to prompt for
the user's password. Again, you have to have the user set up in Postgres and have it
configured to use password authentication for this to work.
