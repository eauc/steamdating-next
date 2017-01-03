export let __hotReload = true;

import R from 'ramda';

export const updateIn = R.curry(function _updateIn(path, value, object) {
  const [prop, ...rest] = path;
  if (R.isNil(prop)) return value;
  if (R.type(object) === 'Array') {
    const propAsNumber = Number(prop);
    if (propAsNumber >= 0) {
      return R.update(
        propAsNumber,
        _updateIn(rest, value, object[propAsNumber]),
        object
      );
    }
  }
  if (R.type(object) !== 'Object') {
    return { [prop]: _updateIn(rest, value, null) };
  }
  return R.assoc(
    prop,
    _updateIn(rest, value, object[prop]),
    object
  );
});
