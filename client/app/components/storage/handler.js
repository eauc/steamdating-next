export let __hotReload = true;

import stateService from 'app/services/state';
const { registerHandler } = stateService;
import { storageRefreshHandler } from 'app/components/storage/state';

registerHandler('storage-refresh', storageRefreshHandler);
