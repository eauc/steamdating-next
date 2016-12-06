export let __hotReload = true;

import R from 'app/helpers/ramda';
import log from 'app/helpers/log';

const COEFFECTS_REG = {};

export const coeffects = R.curry(function _coeffects(list, handler) {
  return function (state, event) {
    const context = R.reduce((mem, item) => {
      if (R.isNil(COEFFECTS_REG[item])) {
        return mem;
      }
      return R.assoc(item, COEFFECTS_REG[item](state), mem);
    }, { state }, list);
    return handler(context, event);
  };
});

export function registerCoeffect(coeffect, handler) {
  if (R.exists(COEFFECTS_REG[coeffect])) {
    log.warn('Coeffect already registered', coeffect);
  }
  else {
    log.info('Register coeffect', coeffect);
  }
  COEFFECTS_REG[coeffect] = handler;
}
