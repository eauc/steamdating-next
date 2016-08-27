export let __hotReload = true;

import R from 'app/helpers/ramda';
import { registerSubscription } from 'app/services/state';
import { scope } from 'app/components/error/state';

export const errorSub = registerSubscription(
  'error',
  (state) => state.map(R.path(scope))
);
