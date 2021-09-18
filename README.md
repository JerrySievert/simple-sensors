# Sensors

A simple sensor web service built for a friend.

## Configuring

## Database Setup

PostgreSQL is required.

In addition, the `btree_gin` extension must be installed in the database to be used.

Once `config.json` is set up with the proper credentials, you need to set up the tables by running the migrations:

```shell
npm run migrate up
```
