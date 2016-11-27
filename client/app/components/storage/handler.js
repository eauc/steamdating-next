export let __hotReload = true;

import { registerHandler } from 'app/services/state';
import stripEvent from 'app/helpers/middlewares/stripEvent';
import { storageRefreshHandler } from 'app/components/storage/state';

registerHandler('storage-refresh', [
  stripEvent,
], storageRefreshHandler);
