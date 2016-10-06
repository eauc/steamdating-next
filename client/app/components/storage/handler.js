export let __hotReload = true;

import { registerHandler } from 'app/services/state';
import stripv from 'app/helpers/middlewares/stripv';
import { storageRefreshHandler } from 'app/components/storage/state';

registerHandler('storage-refresh', [
  stripv,
], storageRefreshHandler);
