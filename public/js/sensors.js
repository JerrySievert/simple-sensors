const sensors = {
  gauges: { },
  graphs: { }
};

const conversions = {
  'Temperature ºF': {
    symbol: 'º',
    short: 'temp_f'
  },
  'Temperature ºC': {
    symbol: 'º',
    short: 'temp_c'
  },
  'Relative Humidity': {
    symbol: '%',
    short: 'rel_h'
  },
  'Absolute Humidity': {
    symbol: '%',
    short: 'abs_h'
  },
};

let initialized = false;

const getTypes = async () => {
  const results = await fetch('/api/types');
  const data = await results.json();

  return data.types;
};

const createRow = (type, id) => {
  const row = document.createElement('div');
  row.classList.add('container_sensors');
  row.id = type;

  const currentContainer = document.createElement('div');
  currentContainer.classList.add('current_container');

  const currentValue = document.createElement('div');
  currentValue.classList.add('current_value');
  currentValue.id = `${conversions[type].short}_current`;
  currentContainer.append(currentValue);

  const lastUpdate = document.createElement('div');
  lastUpdate.classList.add('last_update');
  lastUpdate.id = `${conversions[type].short}_last`;
  currentContainer.append(lastUpdate);

  row.append(currentContainer);

  const historicValue = document.createElement('div');
  historicValue.classList.add('historic_value');
  historicValue.id = `${conversions[type].short}_historic`;

  row.append(historicValue);

  const parent = document.getElementById(id);
  if (parent) {
    parent.append(row);
  }

  sensors.graphs[type] = new DataGraph(`#${conversions[type].short}_historic`, {
    y_accessor: 'value',
    title: type,
    yax_units: 'º',
    x_label: 'Hour',
    height: 700,
    top: 50,
    left: 100
  });
};

const getData = async (type, location_id) => {
  let data = await fetch(`/api/data?location_id=${location_id}&type=${type}`);
  return await data.json();
};

const getLatestData = async (type, location_id) => {
  const latest = await fetch(`/api/latest?location_id=1&type=${type}`);
  const data = await latest.json();
  if (!data.data) {
    return;
  }
  const element = document.getElementById(`${conversions[type]?.short}_current`);
  if (element) {
    element.innerHTML = data.data.value + conversions[type]?.symbol;
  }
  const latestDiv = document.getElementById(`${conversions[type]?.short}_last`);
  if (latestDiv) {
    latestDiv.innerHTML = new Date(Date.parse(data.data.created_date)).toString();
  }

};

const updateGraph = (type, data) => {
  sensors.graphs[type].update(data);
};

const updateData = async (location_id) => {
  const types = await getTypes();
  for (const type of types) {
    const data = await getData(type, location_id);
    if (!initialized && data.data.length) {
      createRow(type, 'content');
    }

    data.data.forEach(row => {
      row.date = new Date(Date.parse(row.created_date));
    });

    let processed = data.data;//MG.convert.date(data.data, 'date', '%Y-%m-%dT%H:%M:%S.%LZ');

    if (processed.length) {
      updateGraph(type, processed);
    }
    await getLatestData(type, location_id);
  }

  initialized = true;
};
