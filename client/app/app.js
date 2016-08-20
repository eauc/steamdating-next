export let __hotReload = true;

import React from 'react';
import ReactDOM from 'react-dom';

import log from 'app/services/log';
import offlineService from 'app/services/offline';
import { Nav } from 'app/components/nav/view';
import { Root } from 'app/components/root/view';

self.STEAMDATING_APP = {
  init: appInit
};

ReactDOM.render((
  <Nav />
), document.querySelector('.sd-nav-menu'));

ReactDOM.render((
  <Root />
), document.querySelector('.sd-content'));

function appInit() {
  log('STEAMDATING APP init');
  if(!self.STEAMDATING_CONFIG.debug) {
    offlineService.registerWorker();
  }
}
