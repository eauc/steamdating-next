export let __hotReload = true;

import R from 'ramda';

import { dispatch, registerHandler } from 'app/services/state';

let timeout;

registerHandler('error-set', (state, [_event_, msg]) => {
  if(timeout) self.clearTimeout(timeout);
  timeout = self.setTimeout(() => dispatch(['error-clear']), 1000);
  return R.assoc('error', msg, state);
});

registerHandler('error-clear', (state) => {
  timeout = null;
  return R.assoc('error', null, state);
});
