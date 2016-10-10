export let __hotReload = true;

import R from 'app/helpers/ramda';
import { registerSubscription } from 'app/services/state';
import { scope } from 'app/components/auth/state';
import authModel from 'app/models/auth';

export const authActiveSub = registerSubscription(
  'auth-active',
  (state) => state
    .map(R.pathOr({}, scope))
    .map(authModel.isActive)
);
