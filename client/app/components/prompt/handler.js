export let __hotReload = true;

import R from 'app/helpers/ramda';
import { effects } from 'app/helpers/middlewares/effects';
import stateService from 'app/services/state';
const { registerHandler } = stateService;
import path from 'app/helpers/middlewares/path';
import stripEvent from 'app/helpers/middlewares/stripEvent';
import { scope } from 'app/components/prompt/state';

const middlewares = [
  path(scope, null),
  stripEvent,
];

registerHandler('prompt-set', middlewares, (_state_, [prompt]) => prompt);

registerHandler('prompt-update-value', middlewares, promptUpdateValueHandler);

registerHandler('prompt-ok', [
  middlewares,
  effects,
], promptOkHandler);

registerHandler('prompt-cancel', [
  middlewares,
  effects,
], promptCancelHandler);

export function promptUpdateValueHandler(state, [value]) {
  return R.assoc('value', value, state);
}

export function promptOkHandler(state) {
  let event = state.onOk;
  if (state.type === 'prompt') {
    event = R.append(state.value, event);
  }
  return {
    dispatch: event,
    state: null,
  };
}

export function promptCancelHandler(state) {
  const effects = { state: null };
  if (state.onCancel) effects.dispatch = state.onCancel;
  return effects;
}
