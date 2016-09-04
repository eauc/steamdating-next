export let __hotReload = true;

import R from 'app/helpers/ramda';
self.R = R;
import Joi from 'joi-browser';
self.Joi = Joi;

import React from 'react';
export * from 'app/helpers/react';
import ReactDOM from 'react-dom';

import log from 'app/helpers/log';
import offlineService from 'app/services/offline';
import { NavMenu } from 'app/components/nav/nav';
import { Root } from 'app/components/root/root';
import { Prompt } from 'app/components/prompt/prompt';
import { dispatch, stateDebug } from 'app/services/state';
export * from 'app/services/init';
export * from 'app/components/storage/storage';

self.STEAMDATING_APP = {
  init: appInit,
  state: stateDebug
};

ReactDOM.render((
  <NavMenu />
), document.querySelector('.sd-NavMenu-container'));

ReactDOM.render((
  <Root />
), document.querySelector('.sd-Page-container'));

ReactDOM.render((
  <Prompt />
), document.querySelector('.sd-Prompt-container'));

function appInit() {
  log('STEAMDATING APP init');
  if(!self.STEAMDATING_CONFIG.debug) {
    offlineService.registerWorker();
  }
  dispatch(['init']);
}
