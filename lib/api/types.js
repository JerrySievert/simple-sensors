'use strict';

const { query } = require('../db');

const route = async (request) => {
  let types;
  try {
    [ types ] = await query(`
      SELECT array_to_json(enum_range(NULL::sensor_type)) AS enum_range
    `);
  } catch (err) {
    console.log(err);
  }

  return { status: 'ok', types: types.enum_range };
};

module.exports = exports = route;
