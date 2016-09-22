export let __hotReload = true;

import { registerSubscription } from 'app/services/state';

export const stateDebugSub = registerSubscription(
  'state-debug', (state) => state
);
