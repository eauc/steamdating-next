export let __hotReload = true;

import R from 'app/helpers/ramda';
import stateService from 'app/services/state';
const { registerSubscription } = stateService;
import { scope } from 'app/components/prompt/state';

export const promptSub = registerSubscription(
  'prompt',
  (state) => state.map(R.path(scope))
);
