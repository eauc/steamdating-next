export let __hotReload = true;

import R from 'app/helpers/ramda';
import log from 'app/helpers/log';
import { dispatch, registerHandler,
         registerSubscription, getPermanentSubscription
       } from 'app/services/state';
import stripv from 'app/helpers/middlewares/stripv';

const default_state = {
  error: null,
  forms: {}
};

const STATE_KEY = 'STEAMDATING_APP.state';

let refreshing = false;
const stateStoreSub = registerSubscription(
  'state-store',
  (state) => {
    let initialized = false;
    return state
      .map((state) => {
        if(!initialized) {
          initialized = true;
          return;
        }
        if(refreshing) {
          refreshing = false;
          return;
        }
        log.storage('state-store', state);
        self.localStorage
          .setItem(STATE_KEY, R.jsonStringify(null, state));
      });
  }
);

getPermanentSubscription('state-store', [ stateStoreSub ]);

registerHandler('init', () => {
  refreshing = true;
  const stored_state = R.thread(STATE_KEY)(
    (key) => self.localStorage.getItem(key),
    R.jsonParse,
    R.defaultTo({})
  );
  log.storage('state-load', stored_state);
  return Object.assign(default_state, stored_state);
});

registerHandler('state-refresh', [
  stripv
], (state, [refresh]) => {
  refreshing = true;
  return R.deepMerge([refresh], state);
});

function storageListener(event) {
  if(event.key !== STATE_KEY) return;
  const new_state = R.jsonParse(event.newValue);
  if(new_state) dispatch(['state-refresh', new_state]);
}

if(self._storageListener) {
  self.removeEventListener('storage', self._storageListener);
}
self._storageListener = storageListener;
self.addEventListener('storage', storageListener);
