'use strict';

const Hapi = require('@hapi/hapi');
const config = require('./config.json');
const db = require('./lib/db');

// jwt validation code
const validate = async (artifacts, request, h) => {
  if (artifacts.decoded.payload.location_id) {
    if (await db.location.exists(artifacts.decoded.payload.location_id)) {
      return {
        isValid: true,
        credential: { location_id: artifacts.decoded.payload.location_id }
      };
    } else {
      return {
        isValid: false
      };
    }
  }

  return {
    isValid: false
  };
};

const init = async () => {
  const server = Hapi.server({
    port: config.http?.port ?? 5000,
    host: config.http?.host ?? 'localhost'
  });

  await server.register(require('@hapi/jwt'));
  server.auth.strategy('jwt', 'jwt', {
    keys: config.security.jwt.secret,
    validate,
    verify: {
     aud: 'urn:audience:sensors',
     iss: 'urn:issuer:sensors',
     sub: false
   }
  });

  await server.register(require('@hapi/inert'));

  // api routes
  server.route({
    method: 'GET',
    path: '/api/data',
    handler: require('./lib/api/data')
  });

  server.route({
    method: 'GET',
    path: '/api/latest',
    handler: require('./lib/api/latest')
  });

  server.route({
    method: 'GET',
    path: '/api/types',
    handler: require('./lib/api/types')
  });

  server.route({
    method: 'POST',
    path: '/api/update',
    handler: require('./lib/api/update'),
    config: { auth: 'jwt' }
  });

  // file serving from the public directory
  server.route({
    method: 'GET',
    path: '/{param*}',
    handler: {
      directory: {
        path: 'public',
        index: [ 'index.html', 'default.html' ]
      }
    }
  });

  await server.start();
  console.log('Server running on %s', server.info.uri);
};

process.on('unhandledRejection', (err) => {
  console.log(err);
  process.exit(1);
});

init();
