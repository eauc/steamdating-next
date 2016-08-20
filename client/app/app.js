export let __hotReload = true;

import R from 'ramda';
import log from 'app/services/log';
import offlineService from 'app/services/offline';

self.STEAMDATING_APP = {
  init: appInit
};

log(R);

function appInit() {
  log('STEAMDATING APP init');
  if(!self.STEAMDATING_CONFIG.debug) {
    offlineService.registerWorker();
  }
}
