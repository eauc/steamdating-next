import expressState from 'express-state';

module.exports = (app) => {
  expressState.extend(app);

  app.set('state namespace', 'JSPM_APP_CONFIG');

  app.expose({
    root: 'root' // process.env.TASKS_API_ROOT || app.config.TASKS_API.root
  }, 'tasksApi');

  // app.expose({
  //   client_id: process.env.AUTH0_CLIENT_ID || app.config.AUTH0.client_id,
  //   domain: process.env.AUTH0_DOMAIN || app.config.AUTH0.domain
  // }, 'auth0Api');
};
