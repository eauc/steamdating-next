export let __hotReload = true;

import R from 'ramda';
import Joi from 'joi-browser';
import log from 'app/helpers/log';
import { dispatch } from 'app/services/state';

export default R.curry(function validateArgs(args_schema, handler) {
  const schema = Joi.array().ordered(...args_schema);
  return function(state, [event, ...args]) {
    const validation = Joi.validate(args, schema);
    if(!validation.error) return handler(state, [event, ...args]);

    log.error(`Args validation error: ${validation.error.message}`, validation);
    if(!event.startsWith('error')) dispatch(['error-set', 'Invalid arguments']);
    return state;
  };
});
