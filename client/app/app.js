export let __hotReload = true;

import R from 'app/helpers/ramda';
self.R = R;
import Ajv from 'ajv';
self.Ajv = Ajv;

/* eslint-disable no-unused-vars */
import React from 'react';
import { NavMenu } from 'app/components/nav/nav';
import { PageRoot } from 'app/components/page/page';
import { Prompt } from 'app/components/prompt/prompt';
/* eslint-enable no-unused-vars */
export * from 'app/helpers/react';
import ReactDOM from 'react-dom';

import log from 'app/helpers/log';
import offlineService from 'app/services/offline';
import stateService from 'app/services/state';
const { dispatch, stateDebug } = stateService;
export * from 'app/services/init';
export * from 'app/components/storage/storage';

self.STEAMDATING_APP = {
  init: appInit,
  state: stateDebug,
};

ReactDOM.render((
  <NavMenu />
), document.querySelector('.sd-NavMenu-container'));

ReactDOM.render((
  <PageRoot />
), document.querySelector('.sd-Page-container'));

ReactDOM.render((
  <Prompt />
), document.querySelector('.sd-Prompt-container'));

function appInit() {
  log('STEAMDATING APP init');
  if (!self.STEAMDATING_CONFIG.debug &&
      !self.STEAMDATING_CONFIG.test) {
    offlineService.registerWorker();
  }
  dispatch(['init']);
}

// eslint-disable-next-line no-unused-vars
// import { DebugMain } from 'app/components/debug/debug';
// ReactDOM.render((
//   <DebugMain />
// ), document.querySelector('.sd-Debug'));
if (self.STEAMDATING_CONFIG.debug) {
  System.import('app/components/debug/debug')
  // eslint-disable-next-line no-unused-vars
    .then(({ DebugMain }) => {
      ReactDOM.render((
        <DebugMain />
      ), document.querySelector('.sd-Debug'));
    });
}
