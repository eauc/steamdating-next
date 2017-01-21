export let __hotReload = true;

import R from 'ramda';

export const lensPropOr = R.curry(_lensPropOr);
function _lensPropOr(or, prop) {
  return R.lens(R.propOr(or, prop), R.assoc(prop));
}

export const lensPathOr = R.curry(_lensPathOr);
function _lensPathOr(or, path) {
  return R.lens(R.pathOr(or, path), R.assocPath(path));
}
