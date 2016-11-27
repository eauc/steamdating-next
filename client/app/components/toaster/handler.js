export let __hotReload = true;

import { dispatch, registerHandler } from 'app/services/state';
import path from 'app/helpers/middlewares/path';
import stripEvent from 'app/helpers/middlewares/stripEvent';
import validateArgs from 'app/helpers/middlewares/validateArgs';
import { scope, toasterSchema } from 'app/components/toaster/state';

const middlewares = [
  path(scope, null),
  stripEvent,
];

registerHandler('toaster-set', [
  validateArgs([toasterSchema]),
  middlewares,
], toasterSetHandler);

registerHandler('toaster-clear', middlewares, toasterClearHandler);

let timeout;

export function toasterSetHandler(_state_, [toaster]) {
  if (timeout) self.clearTimeout(timeout);
  timeout = self.setTimeout(() => dispatch(['toaster-clear']), 1000);
  return toaster;
}

export function toasterClearHandler(_state_) {
  timeout = null;
  return null;
}
