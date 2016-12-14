export let __hotReload = true;

import R from 'app/helpers/ramda';
import log from 'app/helpers/log';
import stateService from 'app/services/state';
import { registerInit } from 'app/services/init';

export const STATE_STORAGE_KEY = 'STEAMDATING_APP.state';

if (self._storageListener) {
  self.removeEventListener('storage', self._storageListener);
}
self._storageListener = storageListener;
self.addEventListener('storage', storageListener);

registerInit('storage', [], storageInit);

export function storageListener(event) {
  if (event.key !== STATE_STORAGE_KEY) return;
  const newState = R.jsonParse(event.newValue);
  if (newState) {
    stateService.dispatch({
      eventName: 'storage-refresh',
      newState,
    });
  }
}

let refreshing = true;

export function storageInit(state) {
  refreshing = true;
  const storedState = R.thread(STATE_STORAGE_KEY)(
    (key) => self.localStorage.getItem(key),
    R.jsonParse,
    R.defaultTo({})
  );
  log.storage('state-load', storedState);
  return R.deepMerge([storedState], state);
}

export function storageUpdate(state) {
  if (refreshing) {
    refreshing = false;
    return;
  }
  log.storage('state-store', state);
  self.localStorage
    .setItem(STATE_STORAGE_KEY, R.jsonStringify(null, state));
}

export function storageRefreshHandler(state, { newState }) {
  refreshing = true;
  return R.deepMerge([newState], state);
}
