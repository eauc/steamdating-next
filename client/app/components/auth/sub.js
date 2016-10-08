export let __hotReload = true;

import R from 'app/helpers/ramda';
import { registerSubscription } from 'app/services/state';
import { scope } from 'app/components/auth/state';

export const authActiveSub = registerSubscription(
  'auth-active',
  (state) => state
    .map(R.pathOr(null, [...scope, 'token']))
    .map(R.exists)
);
