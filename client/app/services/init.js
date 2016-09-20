export let __hotReload = true;

import R from 'app/helpers/ramda';
import log from 'app/helpers/log';
import { registerHandler } from 'app/services/state';

registerHandler('init', initHandler);

const default_state = {};
let initializers = {};

export function registerInit(name, dependencies, fn) {
  if(R.exists(initializers[name])) {
    log('Overwriting initializer', name);
  }
  initializers[name] = [dependencies, fn];
}

export function initHandler() {
  initializers.storage[0] = R.thread(initializers)(
    R.keys,
    R.without(['storage']),
    R.filter((name) => {
      const [dependencies] = initializers[name];
      return !R.contains('storage', dependencies);
    })
  );
  const [names] = R.reduce(resolveDependencies, [[],[]], R.keys(initializers));
  log.init('Initializers will run', names);
  return R.reduce(applyInitializer, default_state, names);
}

function resolveDependencies([names, currents], name) {
  if(R.contains(name, currents)) {
    log.error('Init resolve dependencies : circular dependency',
              `${currents.join(' > ')} > ${name}`, names);
    return [names,currents];
  }
  if(R.contains(name, names)) {
    return [names,currents];
  }
  [names] = R.reduce(
    resolveDependencies,
    [names, [...currents, name]],
    initializers[name][0]
  );
  return [R.append(name, names), currents];
}

function applyInitializer(state, name) {
  log.init(name);
  try {
    return initializers[name][1](state);
  }
  catch(e) {
    log.error('Error in initializer', name, e);
    return state;
  }
}

// TESTS ONLY
export function resetInitializers() {
  initializers = {};
}
