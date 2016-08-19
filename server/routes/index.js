module.exports = (app) => {
  app.get('/dev/', devIndexRoute);
  app.get('/', distIndexRoute);
};

function devIndexRoute(_request_, response) {
  response.render('app/index.handlebars');
}

function distIndexRoute(_request_, response) {
  response.render('dist/index.handlebars');
}
