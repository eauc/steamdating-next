export let __hotReload = true;

import R from 'ramda';
import { registerSubscription } from 'app/services/state';

registerSubscription('error', () => {
  return R.prop('error');
});
