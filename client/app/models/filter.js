export let __hotReload = true;

import R from 'app/helpers/ramda';

const filterModel = {
  get: filterGet,
  set: filterSet,
};

export default R.curryService(filterModel);

function filterGet(name, filter) {
  return R.prop(name, filter);
}

function filterSet(name, value, filter) {
  return R.assoc(name, value, filter);
}
