export let __hotReload = true;

import Joi from 'joi-browser';

import { dispatch, registerHandler } from 'app/services/state';
import path from 'app/helpers/middlewares/path';
import stripv from 'app/helpers/middlewares/stripv';
import validateArgs from 'app/helpers/middlewares/validateArgs';
import { scope } from 'app/components/error/state';

const middlewares = [
  path(scope, null),
  stripv
];

registerHandler('error-set', [
  validateArgs([Joi.string()]),
  middlewares
], errorSetHandler);

registerHandler('error-clear', middlewares, errorClearHandler);

let timeout;

export function errorSetHandler(_state_, [msg]) {
  if(timeout) self.clearTimeout(timeout);
  timeout = self.setTimeout(() => dispatch(['error-clear']), 1000);
  return msg;
}

export function errorClearHandler(_state_) {
  timeout = null;
  return null;
}
