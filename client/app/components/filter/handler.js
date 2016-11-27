export let __hotReload = true;

import path from 'app/helpers/middlewares/path';
import stripEvent from 'app/helpers/middlewares/stripEvent';
import { registerHandler } from 'app/services/state';
import filterModel from 'app/models/filter';
import { scope } from 'app/components/filter/state';

const middlewares = [
  path(scope, {}),
  stripEvent,
];

registerHandler(
  'filter-set',
  middlewares,
  (state, [name, value]) => filterModel.set(name, value, state)
);
