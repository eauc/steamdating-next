export let __hotReload = true;

import { registerHandler } from 'app/services/state';
import path from 'app/helpers/middlewares/path';
import stripv from 'app/helpers/middlewares/stripv';
import { scope } from 'app/components/factions/state';

registerHandler('factions-set', [
  path(scope, null),
  stripv
], (_state_, [data]) => data);
