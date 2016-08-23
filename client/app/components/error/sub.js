export let __hotReload = true;

import R from 'ramda';
import { registerSubscription } from 'app/services/state';
import { scope } from 'app/components/error/state';

registerSubscription('error', () => {
  return R.path(scope);
});
