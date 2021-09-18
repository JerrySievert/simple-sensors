'use strict'

const db = require('../lib/db');

module.exports.up = async function(next) {
  await db.query(`
    CREATE INDEX IF NOT EXISTS sensor_data_type_created_date_index ON sensor_data USING gin (type, created_date)
  `);
}

module.exports.down = async function(next) {
  await db.query('DROP INDEX sensor_data_type_created_date_index');
}
