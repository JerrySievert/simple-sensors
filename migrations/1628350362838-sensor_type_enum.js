'use strict'

const db = require('../lib/db');

module.exports.up = async function(next) {
  await db.query(`
    CREATE TYPE sensor_type AS ENUM (
      'Temperature ºF',
      'Temperature ºC',
      'Relative Humidity',
      'Absolute Humidity',
      'Specific Gravity'
    )`
  );
}

module.exports.down = async function(next) {
  await db.query('DROP TYPE sensor_type');
}
