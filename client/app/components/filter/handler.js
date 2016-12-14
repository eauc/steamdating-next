export let __hotReload = true;

import path from 'app/helpers/middlewares/path';
import stateService from 'app/services/state';
const { registerHandler } = stateService;
import filterModel from 'app/models/filter';
import { scope } from 'app/components/filter/state';

registerHandler('filter-set', [
  path(scope, {}),
], (state, { name, value }) => filterModel.set(name, value, state));
