export let __hotReload = true;

import R from 'ramda';

export default R.curry(function viewOr(val, lens, obj) {
  return R.pipe(
    R.view(lens),
    R.defaultTo(val)
  )(obj);
});
