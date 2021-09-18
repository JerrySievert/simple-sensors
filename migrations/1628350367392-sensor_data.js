'use strict'

const db = require('../lib/db');

module.exports.up = async function(next) {
  await db.query(`
    CREATE TABLE sensor_data (
      id SERIAL PRIMARY KEY,
      location_id INTEGER REFERENCES location(id),
      type sensor_type,
      value NUMERIC,
      created_date TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    )`
  );
}

module.exports.down = async function(next) {
  await db.query('DROP TABLE sensor_data');
}
