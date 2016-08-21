export let __hotReload = true;

import { registerHandler } from 'app/services/state';

const default_state = {
  error: null
};

registerHandler('init', () => {
  return default_state;
});
