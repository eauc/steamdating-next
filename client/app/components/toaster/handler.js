export let __hotReload = true;

import { dispatch, registerHandler } from 'app/services/state';
import path from 'app/helpers/middlewares/path';
import stripv from 'app/helpers/middlewares/stripv';
import validateArgs from 'app/helpers/middlewares/validateArgs';
import { scope, toaster_schema } from 'app/components/toaster/state';

const middlewares = [
  path(scope, null),
  stripv
];

registerHandler('toaster-set', [
  validateArgs(toaster_schema),
  middlewares
], toasterSetHandler);

registerHandler('toaster-clear', middlewares, toasterClearHandler);

let timeout;

export function toasterSetHandler(_state_, [toaster]) {
  if(timeout) self.clearTimeout(timeout);
  timeout = self.setTimeout(() => dispatch(['toaster-clear']), 1000);
  return toaster;
}

export function toasterClearHandler(_state_) {
  timeout = null;
  return null;
}
