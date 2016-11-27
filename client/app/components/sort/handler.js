export let __hotReload = true;

import R from 'app/helpers/ramda';
import { registerHandler } from 'app/services/state';
import { scope, sortSchema } from 'app/components/sort/state';
import path from 'app/helpers/middlewares/path';
import stripEvent from 'app/helpers/middlewares/stripEvent';
import validateArgs from 'app/helpers/middlewares/validateArgs';

registerHandler('sort-set', [
  path(scope, {}),
  validateArgs([
    {
      type: 'string',
      minLength: 1,
    },
    sortSchema,
  ]),
  stripEvent,
], (state, [name, value]) => R.assoc(name, value, state));
