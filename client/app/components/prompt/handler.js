export let __hotReload = true;

import R from 'app/helpers/ramda';
import { dispatch, registerHandler } from 'app/services/state';
import path from 'app/helpers/middlewares/path';
import stripv from 'app/helpers/middlewares/stripv';
import validate from 'app/helpers/middlewares/validate';
import { scope, schema } from 'app/components/prompt/state';

const middlewares = [
  path(scope, null),
  validate(schema),
  stripv
];

registerHandler(
  'prompt-set',
  middlewares,
  (_state_, [prompt]) => prompt
);

registerHandler(
  'prompt-update-value',
  middlewares,
  (state, [value]) => R.assoc('value', value, state)
);

registerHandler(
  'prompt-ok',
  middlewares,
  (state) => {
    let event = state.onOk;
    if(state.type === 'prompt') {
      event = R.append(state.value, event);
    }
    dispatch(event);
    return null;
  }
);

registerHandler(
  'prompt-cancel',
  middlewares,
  (state) => {
    if(state.onCancel) dispatch(state.onCancel);
    return null;
  }
);
