export let __hotReload = true;

import R from 'app/helpers/ramda';
import log from 'app/helpers/log';
import { dispatch } from 'app/services/state';

export default R.curry(function validate(schema, handler) {
  return function (state, [event, ...args]) {
    const newState = handler(state, [event, ...args]);
    const validation = schema.validate(newState, { abortEarly: false });
    if (!validation.error) return newState;

    log.error(`State validation error: ${validation.error.message}`, validation);
    if (!event.startsWith('error')) {
      dispatch(['toaster-set', { type: 'error',
                                 message: 'Invalid state' }]);
    }
    return state;
  };
});
