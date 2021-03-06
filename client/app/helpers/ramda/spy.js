export let __hotReload = true;

import R from 'ramda';
import log from 'app/helpers/log';

export function spy(level, ...args) {
  return R.tap((obj) => {
    log[level](obj, ...args);
  });
}
