export let __hotReload = true;

import R from 'ramda';

export const deepMerge = R.curry(_deepMerge);
export const deepMergeObject = R.curry(_deepMergeObject);
export const deepMergeArray = R.curry(_deepMergeArray);

const _deepMergeObjectFlipped = R.flip(_deepMergeObject);
function _deepMerge(sources, dst) {
  return R.reduce(_deepMergeObjectFlipped, dst, sources);
}

function _deepMergeObject(src, dst) {
  return R.reduce((acc, key) => {
    let srcVal = src[key];
    if ('Object' === R.type(acc[key]) &&
        'Object' === R.type(src[key])) {
      srcVal = _deepMergeObject(src[key], acc[key]);
    }
    if ('Array' === R.type(acc[key]) &&
        'Array' === R.type(src[key])) {
      srcVal = _deepMergeArray(src[key], acc[key]);
    }
    if (acc[key] === srcVal) return acc;
    return R.assoc(key, srcVal, acc);
  }, dst, R.keys(src));
}

function _deepMergeArray(src, dst) {
  let _dst = dst;
  if (_dst.length > src.length) {
    _dst = R.take(src.length, _dst);
  }
  return R.addIndex(R.reduce)((acc, srcVal, ind) => {
    let _srcVal = srcVal;
    if ('Object' === R.type(acc[ind]) &&
        'Object' === R.type(_srcVal)) {
      _srcVal = _deepMergeObject(_srcVal, acc[ind]);
    }
    if ('Array' === R.type(acc[ind]) &&
        'Array' === R.type(_srcVal)) {
      _srcVal = _deepMergeArray(_srcVal, acc[ind]);
    }
    if (acc[ind] === _srcVal) return acc;
    return (
      ind < acc.length
        ? R.update(ind, _srcVal, acc)
        : R.append(_srcVal, acc)
    );
  }, _dst, src);
}
