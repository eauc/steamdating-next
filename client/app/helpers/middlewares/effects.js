export let __hotReload = true;

import R from 'app/helpers/ramda';
import log from 'app/helpers/log';

const EFFECTS_REG = {};

export function effects(handler) {
  return function (state, event) {
    const effectsMap = handler(state, event);
    R.forEach((effect) => {
      if (!R.exists(EFFECTS_REG[effect])) {
        log.error('Unknown effect', effect, effectsMap[effect]);
        return;
      }
      log.effects(effect, effectsMap[effect]);
      EFFECTS_REG[effect](effectsMap[effect]);
    }, R.without(['state'], R.keys(effectsMap)));
    return R.prop('state', effectsMap);
  };
}

export function registerEffect(effect, handler) {
  if (R.exists(EFFECTS_REG[effect])) {
    log.warn('Effect already registered', effect);
  }
  else {
    log.info('Register effect', effect);
  }
  EFFECTS_REG[effect] = handler;
}
