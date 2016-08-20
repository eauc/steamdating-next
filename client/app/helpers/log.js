export let __hotReload = true;

export default function log(...args) {
  if(self.STEAMDATING_CONFIG.debug) console.log(...args);
}

log.info = function info(...args) {
  if(self.STEAMDATING_CONFIG.debug) console.info(...args);
};

log.warn = function warn(...args) {
  if(self.STEAMDATING_CONFIG.debug) console.warn(...args);
};

log.error = function error(...args) {
  console.error(...args);
};
