export let __hotReload = true;

import R from 'app/helpers/ramda';
import { registerSubscription } from 'app/services/state';
import { scope } from 'app/components/toaster/state';

export const toasterSub = registerSubscription(
  'toaster',
  (state) => state.map(R.path(scope))
);
