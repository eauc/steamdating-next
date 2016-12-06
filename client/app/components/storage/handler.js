export let __hotReload = true;

import stateService from 'app/services/state';
const { registerHandler } = stateService;
import stripEvent from 'app/helpers/middlewares/stripEvent';
import { storageRefreshHandler } from 'app/components/storage/state';

registerHandler('storage-refresh', [
  stripEvent,
], storageRefreshHandler);
