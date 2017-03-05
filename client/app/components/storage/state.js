export let __hotReload = true;

import R from 'app/helpers/ramda';
import log from 'app/helpers/log';
import stateService from 'app/services/state';

export const STATE_STORAGE_KEY = 'STEAMDATING_APP.state';

if (self._storageListener) {
  self.removeEventListener('storage', self._storageListener);
}
self._storageListener = storageListener;
self.addEventListener('storage', storageListener);

let refreshing = 'refreshing';

export function storageListener(event) {
  // log.storage('listener', event, refreshing);
  if (event.key !== STATE_STORAGE_KEY) return;
  const newState = R.jsonParse(event.newValue);
  if (newState) {
    stateService.dispatch({
      eventName: 'storage-refresh',
      newState,
    });
  }
}

export function storageInitHandler(state) {
  refreshing = 'refreshing';
  const storedState = R.thread(STATE_STORAGE_KEY)(
    (key) => self.localStorage.getItem(key),
    R.jsonParse,
    R.defaultTo({})
  );
  log.storage('state-load', storedState, refreshing);
  return R.deepMerge([storedState], state);
}

export function storageUpdate(state) {
  // log.storage('update', state, refreshing);
  if (refreshing) {
    // log.storage('clear-refreshing', refreshing);
    refreshing = null;
    return;
  }
  log.storage('state-store', state, refreshing);
  self.localStorage
    .setItem(STATE_STORAGE_KEY, R.jsonStringify(null, state));
}

export function storageRefreshHandler(state, { newState }) {
  refreshing = 'refreshing';
  // log.storage('refresh', state, newState, refreshing);
  return R.deepMerge([newState], state);
}
