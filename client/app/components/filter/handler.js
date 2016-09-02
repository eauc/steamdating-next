export let __hotReload = true;

import R from 'app/helpers/ramda';
import { registerHandler } from 'app/services/state';
import path from 'app/helpers/middlewares/path';
import stripv from 'app/helpers/middlewares/stripv';
import { scope } from 'app/components/filter/state';

registerHandler(
  'filter-set',
  [ path(scope, {}),
    stripv
  ], (state, [name, value]) => R.assoc(name, value, state)
);