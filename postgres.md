# How to work with Postgres

We switched from using a sqlite database to using Postgres, in order to migrate the
database into the cloud. Several cloud hosts have free Postgres hosting, so we will
start with AWS on John's account - and then may move the db to a free AWS account dedicated to Jobs for Hope, if it makes sense.

To just run the application, you will not need to install any postgres applications on your machine.

The application does, however, need connection information to connect to the AWS
database, and the connection information should not be kept in a public GitHub repo.
The standard way to do this for a node app is to have a file called .env that
belongs in the same folder as the node server file (server.js), but is listed
in the .gitignore file, so that it is not in the public repo. We need to
distribute this file to each member of the team via a more secure channel.

## Installing Postgres locally and/or installing Postgres utilities

You can install Postgres by installing the package from here:
https://www.enterprisedb.com/downloads/postgres-postgresql-downloads

This will install pdAdmin, a good administration tool which allows you to connect
to Postgres databases, view data, etc.

To use these utilities from your terminal, you will need to add the apprpriate folder to
your path. On a Mac, I needed to add

```
PATH=/Library/PostgreSQL/11/bin:$PATH
```

to my .bash_profile file

## Moving a Postgres Database

Now, to dump the contents of a local postgres database "jobsforhope" to a file:

```
pg_dump -d jobsforhope -U postgres  -f jobsforhope.sql
```

To upload this database to a remote postgres database, first create the remote database, then

```

psql -f jobsforhope.sql --host <database host goes here> --port 5432 --username jobsforhope --dbname jobsforhope
```

You should be prompted for the remote database password, and then the data should be imported to the remote
database.
