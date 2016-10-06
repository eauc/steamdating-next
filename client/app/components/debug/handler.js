export let __hotReload = true;

import R from 'app/helpers/ramda';
import { registerHandler } from 'app/services/state';
import stripv from 'app/helpers/middlewares/stripv';

registerHandler('debug-set', [
  stripv,
], function debugSetHandler(state, [path, value]) {
  return R.updateIn(path, value, state);
});

registerHandler('debug-remove', [
  stripv,
], function debugRemoveHander(state, [path]) {
  return R.dissocIn(path, state);
});
