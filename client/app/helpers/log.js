export let __hotReload = true;

self.STEAMDATING_CONFIG = self.STEAMDATING_CONFIG || {};
// self.STEAMDATING_CONFIG.debug = true;
self.STEAMDATING_CONFIG.debugFlags = {
  cell: 'debug',
  // cell: null,
  // cycle: 'warn',
  cycle: null,
  effects: 'debug',
  // effects: null,
  form: 'debug',
  // form: null,
  http: 'debug',
  init: 'log',
  // sub: 'debug',
  sub: null,
  state: 'info',
  storage: 'warn',
  // validator: 'debug',
  validator: null,
};

export default (function () {
  let log = self.STEAMDATING_CONFIG.debug
        ? console.log.bind(console)
        : () => {};

  log.log = self.STEAMDATING_CONFIG.debug
    ? console.log.bind(console)
    : () => {};
  log.info = self.STEAMDATING_CONFIG.debug
    ? console.info.bind(console)
    : () => {};
  log.warn = self.STEAMDATING_CONFIG.debug
    ? console.warn.bind(console)
    : () => {};
  log.error = console.error.bind(console);

  for (let flag in self.STEAMDATING_CONFIG.debugFlags) {
    if (self.STEAMDATING_CONFIG.debugFlags.hasOwnProperty(flag)) {
      log[flag] = (self.STEAMDATING_CONFIG.debug &&
                   self.STEAMDATING_CONFIG.debugFlags[flag])
        ? console[self.STEAMDATING_CONFIG.debugFlags[flag]].bind(console, `#${flag}`)
        : () => {};
    }
  }

  return log;
})();
