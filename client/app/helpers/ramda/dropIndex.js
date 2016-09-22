export let __hotReload = true;

import R from 'ramda';

export const dropIndex = R.curry(function _dropIndex(index, array) {
  return R.concat(R.take(index, array), R.drop(index+1, array));
});
