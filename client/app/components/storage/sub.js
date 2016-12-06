export let __hotReload = true;

import stateService from 'app/services/state';
const { registerSubscription,
         getPermanentSubscription,
      } = stateService;
import { storageUpdate } from 'app/components/storage/state';

const stateStoreSub = registerSubscription(
  'state-store',
  (state) => state
    .map(storageUpdate)
);

getPermanentSubscription('state-store', [stateStoreSub]);
