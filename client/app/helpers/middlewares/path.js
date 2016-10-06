export let __hotReload = true;

import R from 'app/helpers/ramda';

export default R.curry(function path(scopePath, or, handler) {
  return function (state, event) {
    const scope = R.pathOr(or, scopePath, state);
    const newScope = handler(scope, event);
    if (scope === newScope) return state;
    return R.assocPath(scopePath, newScope, state);
  };
});
