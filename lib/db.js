'use strict'

const pgp = require('pg-promise')({
  pgFormatting: true,
});

const config = require('../config.json');

const setup = (database) => {
  let conf = {};

  if (database.username) {
    conf.user = database.username;
  }

  if (database.password) {
    conf.password = database.password;
  }

  if (database.hostname) {
    conf.host = database.hostname;
  }

  if (database.database) {
    conf.database = database.database;
  }

  if (database.maxConnections) {
    conf.max = database.maxConnections;
  }

  if (database.port) {
    conf.port = database.port;
  }

  return conf;
};

const conf = setup(config.database.postgres);
const db = {
  connection: pgp(conf)
};
db.query = db.connection.query;
db.location = {
  exists: async (location_id) => {
    const sql = `
      SELECT id FROM location WHERE id = $1 AND enabled = 't'
    `;

    let [ row ] = await db.query(sql, [ location_id ]);
    if (!row) {
      return false;
    }

    return true;
  }
};

db.sensor_data = {
  all: async (options) => {
    const { location_id, start_date, end_date, type } = options;
    let where_clause = [ ];
    let bind = [ ];
    let current_clause = 1;

    where_clause.push(`created_date >= $${current_clause++}`);
    bind.push(start_date);
    where_clause.push(`created_date < $${current_clause++}`);
    bind.push(end_date);

    if (location_id !== null) {
      where_clause.push(`location_id = $${current_clause++}`);
      bind.push(location_id);
    }

    if (type !== null) {
      where_clause.push(`type = $${current_clause++}`);
      bind.push(type);
    }

    let sensor_data;
    try {
      let sql = `
        SELECT type,
               value,
               created_date
          FROM sensor_data
         WHERE ${where_clause.join(' AND ')}
         ORDER BY created_date
      `;

      sensor_data = await db.query(sql, bind);
    } catch (err) {
      console.log(err);
    }

    return sensor_data;
  },
  insert: async (location_id, type, value, created_date) => {
    const sql = `
      INSERT INTO sensor_data (location_id, type, value, created_date) VALUES
      ( $1, $2, $3, $4)
      RETURNING *
    `;

    let [ row ] = await db.query(sql, [ location_id, type, value, created_date ]);

    return row;
  },
  latest: async (options) => {
    const { location_id, type } = options;
    let where_clause = [ ];
    let bind = [ ];
    let current_clause = 1;

    if (location_id !== null) {
      where_clause.push(`location_id = $${current_clause++}`);
      bind.push(location_id);
    }

    if (type !== null) {
      where_clause.push(`type = $${current_clause++}`);
      bind.push(type);
    }

    let sensor_data;
    try {
      let sql = `
        SELECT type,
               value,
               created_date
          FROM sensor_data
         WHERE ${where_clause.join(' AND ')}
         ORDER BY created_date DESC
         LIMIT 1
      `;

      sensor_data = await db.query(sql, bind);
    } catch (err) {
      console.log(err);
    }

    return sensor_data;
  },
};


module.exports = exports = db;
