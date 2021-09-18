'use strict';

const db = require('../db');

const route = async (request) => {
  let start_date = request.query?.start_date ?? new Date(+(new Date()) - (60 * 60 * 24 * 1000));
  let end_date = request.query?.end_date ?? new Date();
  let location_id = request.query?.location_id ?? null;
  let type = request.query?.type ?? null;

  const sensor_data = await db.sensor_data.all({ location_id, start_date, end_date, type });

  return { status: 'ok', data: sensor_data };
};

module.exports = exports = route;
