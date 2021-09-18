'use strict';

const db = require('../db');

const route = async (request) => {
  let location_id = request.query?.location_id ?? null;
  let type = request.query?.type ?? null;

  if (location_id === null || type === null) {
    return { status: 'error', error: 'Must include both a location_id and type' };
  }

  const [sensor_data] = await db.sensor_data.latest({ location_id, type });

  return { status: 'ok', data: sensor_data };
};

module.exports = exports = route;
