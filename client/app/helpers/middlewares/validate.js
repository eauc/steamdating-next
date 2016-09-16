export let __hotReload = true;

import R from 'app/helpers/ramda';
import log from 'app/helpers/log';
import { dispatch } from 'app/services/state';

export default R.curry(function validate(schema, handler) {
  return function(state, [event, ...args]) {
    const new_state = handler(state, [event, ...args]);
    const validation = schema.validate(new_state, {abortEarly:false});
    if(!validation.error) return new_state;

    log.error(`State validation error: ${validation.error.message}`, validation);
    if(!event.startsWith('error')) {
      dispatch(['toaster-set', { type: 'error',
                                 message: 'Invalid state' }]);
    }
    return state;
  };
});
