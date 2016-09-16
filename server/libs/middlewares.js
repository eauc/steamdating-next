import express from 'express';
import bodyParser from 'body-parser';
import compression from 'compression';

module.exports = (app) => {
  app.use(compression());
  app.use(express.static('client'));
  app.use(bodyParser.json());
}
;
