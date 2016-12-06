export let __hotReload = true;

import path from 'app/helpers/middlewares/path';
import stripEvent from 'app/helpers/middlewares/stripEvent';
import stateService from 'app/services/state';
const { registerHandler } = stateService;
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
