export let __hotReload = true;

import path from 'app/helpers/middlewares/path';
import stripEvent from 'app/helpers/middlewares/stripEvent';
import { scope } from 'app/components/factions/state';
import stateService from 'app/services/state';
const { registerHandler } = stateService;

registerHandler('factions-set', [
  path(scope, null),
  stripEvent,
], (_state_, [data]) => data);
