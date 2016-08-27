export let __hotReload = true;

import R from 'ramda';

export function jsonParse(string) {
  try {
    return JSON.parse(string);
  }
  catch(e) {
    return undefined;
  }
}

export const jsonStringify = R.curry(_jsonStringify);
function _jsonStringify(replacer, value) {
  if('Array' !== R.type(replacer) &&
     'Function' !== R.type(replacer)) {
    replacer = defaultReplacer;
  }
  return JSON.stringify(value, replacer);
}

const defaultReplacer = R.nthArg(1);
