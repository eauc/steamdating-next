export let __hotReload = true;

import R from 'ramda';

export const debounce = R.curry(_debounce);
function _debounce(delay, fn) {
  let timeout;
  return function debounced(...args) {
    if(timeout) self.clearTimeout(timeout);
    timeout = self.setTimeout(() => {
      timeout = null;
      fn(...args);
    }, delay);
  };
}
