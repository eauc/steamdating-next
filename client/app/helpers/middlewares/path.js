export let __hotReload = true;

import R from 'ramda';

export default R.curry(function path(scope_path, handler) {
  return function(state, event) {
    const scope = R.path(scope_path, state);
    const new_scope = handler(scope, event);
    if(scope === new_scope) return state;
    return R.assocPath(scope_path, new_scope, state);
  };
});
