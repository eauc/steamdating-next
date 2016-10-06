export let __hotReload = true;

import R from 'ramda';

export function jsonParse(string) {
  try {
    return JSON.parse(string);
  }
  catch (error) {
    return undefined;
  }
}

export const jsonStringify = R.curry(_jsonStringify);
function _jsonStringify(replacer, value) {
  let _replacer = replacer;
  if ('Array' !== R.type(replacer) &&
     'Function' !== R.type(replacer)) {
    _replacer = defaultReplacer;
  }
  return JSON.stringify(value, _replacer);
}

const defaultReplacer = R.nthArg(1);
