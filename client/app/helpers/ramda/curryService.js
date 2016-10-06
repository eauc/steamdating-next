export let __hotReload = true;

import R from 'ramda';

export function curryService(obj) {
  return R.pipe(
    R.keys,
    R.filter(R.compose(R.equals('Function'), R.type, R.prop(R.__, obj))),
    R.reject(R.compose(R.not, R.isEmpty, R.match(/\$$/))),
    R.reduce((mem, key) => R.assoc(`${key}$`, R.curry(obj[key]), mem), obj)
  )(obj);
}
