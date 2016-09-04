export let __hotReload = true;

import R from 'app/helpers/ramda';
import log from 'app/helpers/log';
import { dispatch } from 'app/services/state';
import { registerInit } from 'app/services/init';

export const STATE_STORAGE_KEY = 'STEAMDATING_APP.state';
export const storage_state = {
  refreshing: false
};

if(self._storageListener) {
  self.removeEventListener('storage', self._storageListener);
}
self._storageListener = storageListener;
self.addEventListener('storage', storageListener);

registerInit('storage', storageInit);

export function storageListener(event) {
  if(event.key !== STATE_STORAGE_KEY) return;
  const new_state = R.jsonParse(event.newValue);
  if(new_state) dispatch(['storage-refresh', new_state]);
}

export function storageInit(state) {
  storage_state.refreshing = true;
  const stored_state = R.thread(STATE_STORAGE_KEY)(
    (key) => self.localStorage.getItem(key),
    R.jsonParse,
    R.defaultTo({})
  );
  log.storage('state-load', stored_state);
  return R.deepMerge([stored_state], state);
}
