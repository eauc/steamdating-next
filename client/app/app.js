export let __hotReload = true;

import React from 'react';
import ReactDOM from 'react-dom';

import log from 'app/helpers/log';
import offlineService from 'app/services/offline';
import { NavMenu } from 'app/components/nav/view';
import { Root } from 'app/components/root/view';

self.STEAMDATING_APP = {
  init: appInit
};

ReactDOM.render((
  <NavMenu />
), document.querySelector('.sd-NavMenu-container'));

ReactDOM.render((
  <Root />
), document.querySelector('.sd-Page-container'));

function appInit() {
  log('STEAMDATING APP init');
  if(!self.STEAMDATING_CONFIG.debug) {
    offlineService.registerWorker();
  }
}
