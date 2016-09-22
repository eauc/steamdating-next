export let __hotReload = true;

import cellModel from 'app/models/cell.js';
import { stateDebug, registerSubscription } from 'app/services/state';

export const debugStateSub = registerSubscription(
  'debug-state', (state) => state
);

export const debugHistorySub = registerSubscription('debug-history', () => {
  return cellModel.from(stateDebug.history);
});

export const debugLogSub = registerSubscription('debug-log', () => {
  return cellModel.from(stateDebug.log);
});
