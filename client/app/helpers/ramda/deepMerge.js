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
    let src_val = src[key];
    if('Object' === R.type(acc[key]) &&
       'Object' === R.type(src[key])) {
      src_val = _deepMergeObject(acc[key], src[key]);
    }
    if('Array' === R.type(acc[key]) &&
       'Array' === R.type(src[key])) {
      src_val = _deepMergeArray(acc[key], src[key]);
    }
    if(acc[key] === src_val) return acc;
    return R.assoc(key, src[key], acc);
  }, dst, R.keys(src));
}

function _deepMergeArray(src, dst) {
  if(dst.length > src.length) {
    dst = R.take(src.length, dst);
  }
  return R.addIndex(R.reduce)((acc, src_val, ind) => {
    if('Object' === R.type(acc[ind]) &&
       'Object' === R.type(src_val)) {
      src_val = _deepMergeObject(acc[ind], src_val);
    }
    if('Array' === R.type(acc[ind]) &&
       'Array' === R.type(src_val)) {
      src_val = _deepMergeArray(acc[ind], src_val);
    }
    if(acc[ind] === src_val) return acc;
    return R.update(ind, src_val, acc);
  }, dst, src);
}
