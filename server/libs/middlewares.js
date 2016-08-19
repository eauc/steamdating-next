import express from 'express';
import bodyParser from 'body-parser';

module.exports = (app) => {
  app.use(express.static('client'));
  app.use(bodyParser.json());
};
