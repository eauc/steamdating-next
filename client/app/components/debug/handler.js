export let __hotReload = true;

import R from 'app/helpers/ramda';
import stateService from 'app/services/state';
const { registerHandler } = stateService;
import stripEvent from 'app/helpers/middlewares/stripEvent';

registerHandler('debug-set', [
  stripEvent,
], function debugSetHandler(state, [path, value]) {
  return R.updateIn(path, value, state);
});

registerHandler('debug-remove', [
  stripEvent,
], function debugRemoveHander(state, [path]) {
  return R.dissocIn(path, state);
});
