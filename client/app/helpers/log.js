export let __hotReload = true;

import R from 'ramda';

// self.STEAMDATING_CONFIG.debug = true;
self.STEAMDATING_CONFIG.debug_flags = {
  cell: null, //'debug',
  cycle: null, //'warn',
  sub: null, //'debug',
  state: 'info',
  storage: null //'warn'
};

export default (function() {
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

  R.forEach((flag) => {
    log[flag] = ( self.STEAMDATING_CONFIG.debug &&
                  self.STEAMDATING_CONFIG.debug_flags[flag] )
      ? console[self.STEAMDATING_CONFIG.debug_flags[flag]].bind(console, `#${flag}`)
      : () => {};
  }, R.keys(self.STEAMDATING_CONFIG.debug_flags));

  return log;
})();
