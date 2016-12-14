export let __hotReload = true;

import R from 'app/helpers/ramda';
import stateService from 'app/services/state';
const { registerHandler } = stateService;

registerHandler('debug-set', function debugSetHandler(state, { path, value }) {
  return R.updateIn(path, value, state);
});

registerHandler('debug-remove', function debugRemoveHander(state, { path }) {
  return R.dissocIn(path, state);
});
