export let __hotReload = true;

import R from 'app/helpers/ramda';
import log from 'app/helpers/log';
import { registerHandler } from 'app/services/state';

registerHandler('init', initHandler);

const default_state = {};
const initializers = {};

export function registerInit(name, fn) {
  if(R.exists(initializers[name])) {
    log('Overwriting initializer', name);
  }
  initializers[name] = fn;
}

export function initHandler() {
  return R.reduce((state, name) => {
    log.init(name);
    try {
      return initializers[name](state);
    }
    catch(e) {
      log.error('Error in initializer', name, e);
      return state;
    }
  }, default_state, R.keys(initializers));
}
