export let __hotReload = true;

import R from 'app/helpers/ramda';
import log from 'app/helpers/log';
import { registerSubscription,
         getPermanentSubscription
       } from 'app/services/state';
import { storage_state,
         STATE_STORAGE_KEY } from 'app/components/storage/state';

const stateStoreSub = registerSubscription(
  'state-store',
  (state) => {
    return state
      .map(storageUpdate);
  }
);

getPermanentSubscription('state-store', [ stateStoreSub ]);

let initialized = false;
export function storageUpdate(state) {
  if(!initialized) {
    initialized = true;
    return;
  }
  if(storage_state.refreshing) {
    storage_state.refreshing = false;
    return;
  }
  log.storage('state-store', state);
  self.localStorage
    .setItem(STATE_STORAGE_KEY, R.jsonStringify(null, state));
}
