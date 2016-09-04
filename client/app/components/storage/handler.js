export let __hotReload = true;

import R from 'app/helpers/ramda';
import { registerHandler } from 'app/services/state';
import stripv from 'app/helpers/middlewares/stripv';
import { storage_state } from 'app/components/storage/state';

registerHandler('storage-refresh', [
  stripv
], storageRefreshHandler);

export function storageRefreshHandler(state, [refresh]) {
  storage_state.refreshing = true;
  return R.deepMerge([refresh], state);
}
