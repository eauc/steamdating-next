export let __hotReload = true;

import cellModel from 'app/models/cell.js';
import stateService from 'app/services/state';
const { stateDebug, registerSubscription } = stateService;

export const debugStateSub = registerSubscription(
  'debug-state',
  (state) => state
);

export const debugHistorySub = registerSubscription(
  'debug-history',
  () => cellModel.from(stateDebug.history)
);

export const debugLogSub = registerSubscription(
  'debug-log',
  () => cellModel.from(stateDebug.log)
);
