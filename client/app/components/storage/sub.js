export let __hotReload = true;

import { registerSubscription,
         getPermanentSubscription,
       } from 'app/services/state';
import { storageUpdate } from 'app/components/storage/state';

const stateStoreSub = registerSubscription(
  'state-store',
  (state) => state
    .map(storageUpdate)
);

getPermanentSubscription('state-store', [stateStoreSub]);
