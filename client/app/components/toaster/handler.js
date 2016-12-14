export let __hotReload = true;

import R from 'app/helpers/ramda';
import stateService from 'app/services/state';
const { registerHandler } = stateService;
import path from 'app/helpers/middlewares/path';
import { scope } from 'app/components/toaster/state';

registerHandler('toaster-set', [
  path(scope, null),
], toasterSetHandler);

registerHandler('toaster-clear', [
  path(scope, null),
], toasterClearHandler);

let timeout;

export function toasterSetHandler(_state_, toaster) {
  if (timeout) self.clearTimeout(timeout);
  timeout = self.setTimeout(() => {
    stateService.dispatch({ eventName: 'toaster-clear' });
  }, 1000);
  return R.omit(['eventName'], toaster);
}

export function toasterClearHandler(_state_) {
  timeout = null;
  return null;
}
