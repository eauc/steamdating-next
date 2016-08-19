module.exports = (app) => {
  app.set('port', process.env.PORT || 3000);

  const env = process.env.NODE_ENV;
  if (env) {
    return require(`./config.${env}.js`);
  }
  return require('./config.development.js');
};
