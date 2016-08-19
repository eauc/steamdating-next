import expressHandlebars from 'express-handlebars';

module.exports = (app) => {
  app.engine('handlebars', expressHandlebars({}));
  app.set('view engine', 'handlebars');
  app.set('views', 'client');
};
