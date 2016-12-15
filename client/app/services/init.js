export let __hotReload = true;

import R from 'app/helpers/ramda';
import tap from 'app/helpers/middlewares/tap';
import { effects } from 'app/helpers/middlewares/effects';
import log from 'app/helpers/log';
import stateService from 'app/services/state';
const { registerHandler } = stateService;

registerHandler('init', [
  tap,
  effects,
], initHandler);

let initializers = {};

export function registerInit(eventName, dependencies) {
  if (R.exists(initializers[eventName])) {
    log('Overwriting initializer', eventName);
  }
  initializers[eventName] = dependencies;
}

export function initHandler() {
  initializers['storage-init'] = R.thread(initializers)(
    R.keys,
    R.without(['storage-init']),
    R.filter((name) => {
      const dependencies = initializers[name];
      return !R.contains('storage-init', dependencies);
    })
  );
  const [names] = R.reduce(resolveDependencies, [[],[]], R.keys(initializers));
  log.init('Initializers will run', names);
  return {
    dispatch: R.map((eventName) => ({ eventName }), names),
  };
}

function resolveDependencies([names, currents], name) {
  if (R.contains(name, currents)) {
    log.error('Init resolve dependencies : circular dependency',
              `${currents.join(' > ')} > ${name}`, names);
    return [names, currents];
  }
  if (R.contains(name, names)) {
    return [names, currents];
  }
  const [nextNames] = R.reduce(
    resolveDependencies,
    [names, [...currents, name]],
    initializers[name]
  );
  return [R.append(name, nextNames), currents];
}

// TESTS ONLY
export function resetInitializers() {
  initializers = {};
}
