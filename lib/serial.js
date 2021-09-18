const SerialPort = require('serialport');
const Readline = require('@serialport/parser-readline')

const config = require('../config.json');

var port = new SerialPort(config.serialport.port, { parser: new Readline('\n') });
var callback;

port.on('data', function (data) {
  if (callback) {
    callback(null, data);
  } else {
    console.log("no callback registered");
  }
});

function register_callback (cb) {
  callback = cb;
}

exports.register_callback = register_callback;
