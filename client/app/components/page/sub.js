export let __hotReload = true;

import R from 'ramda';
import { registerSubscription } from 'app/services/state';
import { PAGES } from 'app/components/page/state';

export const pageSub = registerSubscription(
  'page',
  (state) => state
    .map(R.propOr('HomePage', 'page'))
    .map(R.propOr(PAGES.HomePage, R.__, PAGES))
);
