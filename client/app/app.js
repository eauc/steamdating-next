export let __hotReload = true;

import R from 'ramda';
import React from 'react';
import ReactDOM from 'react-dom';
import log from 'app/services/log';
import offlineService from 'app/services/offline';
import App from 'app/components/app';

self.STEAMDATING_APP = {
  init: appInit
};

// ReactDOM.render((
//   <App />
// ), document.querySelector('#app'));

function appInit() {
  log('STEAMDATING APP init');
  if(!self.STEAMDATING_CONFIG.debug) {
    offlineService.registerWorker();
  }
}
