'use strict';

const db = require('../db');

const insert = async (location_id, type, value, created_date) => {

  if (type === undefined || value === undefined) {
    return false;
  }

  try {
    await db.sensor_data.insert(location_id, type, value, created_date);
  } catch (err) {
    console.log(err);
    return false;
  }

  return true;
};


const route = async (request) => {
  const location_id = request.auth.credentials.location_id;

  const type = request.payload.type;
  const value = request.payload.value;
  const created_date = request.payload.created_date ?? new Date();

  let result = await insert(location_id, type, value, created_date);

  if (!result && !request.payload.rows) {
    return { status: 'error', error: 'Unable to update sensor data' };
  }

  if (request.payload.rows) {
    let success = result ? 1 : 0;
    let count = success;

    for (const row of request.payload.rows) {
      const created_date = row.created_date ?? new Date();

      let result = await insert(location_id, row.type, row.value, created_date);
      if (result) {
        success++;
      }

      count++;
    }

    return { status: 'ok', message: `Inserted ${success} of ${count} rows` };
  }

  return { status: 'ok' };
};

module.exports = exports = route;
