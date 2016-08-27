export let __hotReload = true;

import R from 'ramda';

export function thread(value) {
  return function(...fn) {
    return R.pipe(...fn)(value);
  };
}

export function threadP(value) {
  return function(...fn) {
    return R.pipeP(() => self.Promise.resolve(value), ...fn)();
  };
}
