module.exports = (app) => {
  app.listen(app.get('port'), () => {
    console.log(`JSPM app - Port ${app.get('port')}`);
  });
};
