'use strict'

const db = require('../lib/db');

module.exports.up = async function(next) {
  await db.query(`
    CREATE TABLE location (
      id SERIAL PRIMARY KEY,
      name TEXT,
      description TEXT,
      data TEXT,
      longitude NUMERIC,
      latitude NUMERIC,
      enabled BOOLEAN,
      created_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_date TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    )`
  );
}

module.exports.down = async function(next) {
  await db.query('DROP TABLE location');
}
