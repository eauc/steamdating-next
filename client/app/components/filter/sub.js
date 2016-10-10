export let __hotReload = true;

import R from 'app/helpers/ramda';
import { registerSubscription } from 'app/services/state';
import filterModel from 'app/models/filter';
import { scope } from 'app/components/filter/state';

export const filterSub = registerSubscription(
  'filter',
  (state, [_sub_, name]) => state
    .map(R.pathOr({}, scope))
    .map(filterModel.get$(name))
);
