export let __hotReload = true;

import R from 'app/helpers/ramda';
import { registerSubscription } from 'app/services/state';
import { scope } from 'app/components/auth/state';

export const authActiveSub = registerSubscription('auth-active', function(state) {
  return state
    .map(R.path([...scope, 'token']))
    .map(R.exists);
});
