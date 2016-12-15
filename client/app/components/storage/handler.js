export let __hotReload = true;

import { registerInit } from 'app/services/init';
import stateService from 'app/services/state';
const { registerHandler } = stateService;
import { storageInitHandler,
         storageRefreshHandler } from 'app/components/storage/state';

registerHandler('storage-init', storageInitHandler);
registerInit('storage-init', []);

registerHandler('storage-refresh', storageRefreshHandler);
