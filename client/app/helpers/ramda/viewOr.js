export let __hotReload = true;

import R from 'ramda';

export const viewOr = R.curry(_viewOr);

function _viewOr(val, lens, obj) {
  return R.pipe(
    R.view(lens),
    R.defaultTo(val)
  )(obj);
}
