export let __hotReload = true;

import R from 'app/helpers/ramda';
import { dispatch, registerHandler } from 'app/services/state';
import path from 'app/helpers/middlewares/path';
import stripEvent from 'app/helpers/middlewares/stripEvent';
import { scope } from 'app/components/prompt/state';

const middlewares = [
  path(scope, null),
  stripEvent,
];

registerHandler('prompt-set', middlewares, (_state_, [prompt]) => prompt);

registerHandler('prompt-update-value', middlewares, promptUpdateValueHandler);

registerHandler('prompt-ok', middlewares, promptOkHandler);

registerHandler('prompt-cancel', middlewares, promptCancelHandler);

export function promptUpdateValueHandler(state, [value]) {
  return R.assoc('value', value, state);
}

export function promptOkHandler(state) {
  let event = state.onOk;
  if (state.type === 'prompt') {
    event = R.append(state.value, event);
  }
  dispatch(event);
  return null;
}

export function promptCancelHandler(state) {
  if (state.onCancel) dispatch(state.onCancel);
  return null;
}
