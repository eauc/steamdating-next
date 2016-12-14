export let __hotReload = true;

import R from 'app/helpers/ramda';
import { effects } from 'app/helpers/middlewares/effects';
import stateService from 'app/services/state';
const { registerHandler } = stateService;
import path from 'app/helpers/middlewares/path';
import { scope } from 'app/components/prompt/state';

registerHandler('prompt-set', [
  path(scope, null),
], (_state_, prompt) => R.omit(['eventName'], prompt));

registerHandler('prompt-update-value', [
  path(scope, null),
], promptUpdateValueHandler);

registerHandler('prompt-ok', [
  path(scope, null),
  effects,
], promptOkHandler);

registerHandler('prompt-cancel', [
  path(scope, null),
  effects,
], promptCancelHandler);

export function promptUpdateValueHandler(state, { value }) {
  return R.assoc('value', value, state);
}

export function promptOkHandler(state) {
  let event = state.onOk;
  if (state.type === 'prompt') {
    event = R.assoc('value', state.value, event);
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
