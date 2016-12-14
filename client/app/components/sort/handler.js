export let __hotReload = true;

import R from 'app/helpers/ramda';
import stateService from 'app/services/state';
const { registerHandler } = stateService;
import { scope } from 'app/components/sort/state';
import path from 'app/helpers/middlewares/path';

registerHandler('sort-set', [
  path(scope, {}),
], (state, { name, reverse, by }) => R.assoc(name, { reverse, by }, state));
