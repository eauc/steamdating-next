export let __hotReload = true;

import path from 'app/helpers/middlewares/path';
import stripv from 'app/helpers/middlewares/stripv';
import { registerHandler } from 'app/services/state';
import filterModel from 'app/models/filter';
import { scope } from 'app/components/filter/state';

const middlewares = [
  path(scope, {}),
  stripv,
];

registerHandler(
  'filter-set',
  middlewares,
  (state, [name, value]) => filterModel.set(name, value, state)
);
