export let __hotReload = true;

import path from 'app/helpers/middlewares/path';
import stripv from 'app/helpers/middlewares/stripv';
import { scope } from 'app/components/factions/state';
import { registerHandler } from 'app/services/state';

registerHandler('factions-set', [
  path(scope, null),
  stripv,
], (_state_, [data]) => data);
