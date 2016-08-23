export let __hotReload = true;

import Joi from 'joi-browser';

import { dispatch, registerHandler } from 'app/services/state';
import path from 'app/helpers/middlewares/path';
import stripv from 'app/helpers/middlewares/stripv';
import validate from 'app/helpers/middlewares/validate';
import validateArgs from 'app/helpers/middlewares/validateArgs';
import { scope, schema } from 'app/components/error/state';

const middlewares = [
  path(scope),
  validate(schema),
  stripv
];

let timeout;

registerHandler('error-set', [
  validateArgs([Joi.string()]),
  middlewares
], (_state_, [msg]) => {
  if(timeout) self.clearTimeout(timeout);
  timeout = self.setTimeout(() => dispatch(['error-clear']), 1000);
  return msg;
});

registerHandler('error-clear', middlewares, (_state_) => {
  timeout = null;
  return null;
});
