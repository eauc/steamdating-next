export let __hotReload = true;

import R from 'app/helpers/ramda';
import { registerSubscription } from 'app/services/state';
import { scope } from 'app/components/sort/state';

export const sortSub = registerSubscription(
  'sort',
  (state, [_sub_, name, defaultValue]) => state
    .map(R.pathOr({ reverse: false, by: defaultValue }, [...scope, name]))
);
