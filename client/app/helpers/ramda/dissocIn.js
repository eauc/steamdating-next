export let __hotReload = true;

import R from 'ramda';
import { dropIndex } from 'app/helpers/ramda/dropIndex';

export const dissocIn = R.curry(function _dissocIn(path, object) {
  const [prop, ...rest] = path;
  if (R.isEmpty(rest)) {
    if (R.type(prop) === 'Number' &&
        R.type(object) === 'Array') {
      return dropIndex(prop, object);
    }
    if (R.type(object) !== 'Object') {
      return object;
    }
    return R.dissoc(prop, object);
  }
  if (R.type(prop) === 'Number' &&
      R.type(object) === 'Array') {
    if (0 > prop || prop >= object.length) return object;
    return R.update(prop, _dissocIn(rest, object[prop]), object);
  }
  if (R.type(object) !== 'Object') {
    return object;
  }
  if (!R.has(prop, object)) return object;
  return R.assoc(prop, _dissocIn(rest, object[prop]), object);
});
