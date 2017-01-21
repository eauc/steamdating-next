export let __hotReload = true;

import R from 'app/helpers/ramda';

const filterModel = {
  get,
  getRegExp,
  set,
};

export default R.curryService(filterModel);

function get(name, filter) {
  return R.propOr('', name, filter);
}

function set(name, value, filter) {
  return R.assoc(name, value, filter);
}

function getRegExp(name, filter) {
  const filterInput = get(name, filter);
  let filterValue = R.isNil(filterInput) || R.isEmpty(filterInput)
        ? '.*'
        : filterInput;
  filterValue = filterValue.replace(/\s+/g, '|');
  return new RegExp(filterValue, 'i');
}
