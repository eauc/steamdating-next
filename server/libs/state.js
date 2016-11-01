import expressState from 'express-state';

module.exports = (app) => {
  expressState.extend(app);

  app.set('state namespace', 'STEAMDATING_CONFIG');

  app.expose(false, 'debug');
  app.expose(!!process.env.TEST, 'test');

  app.expose({
    client_id: process.env.AUTH_CLIENT_ID || app.config.auth.client_id,
    domain: process.env.AUTH_DOMAIN || app.config.auth.domain
  }, 'auth');

  app.expose({
    tournaments: app.config.apis.tournaments
  }, 'apis');
};
