export let __hotReload = true;

import R from 'app/helpers/ramda';

import { registerHandler } from 'app/services/state';
import path from 'app/helpers/middlewares/path';
import stripv from 'app/helpers/middlewares/stripv';
import { scope } from 'app/components/form/state';

const middlewares = [
  path(scope, {}),
  stripv
];

registerHandler('form-reset', middlewares, (state, [form, value]) => {
  return R.thread(state)(
    R.assocPath([form, 'base'], value),
    R.assocPath([form, 'edit'], value)
  );
});

registerHandler('form-update', middlewares, (state, [field, value]) => {
  const [form, ...field_path] = R.split('.', field);
  return R.assocPath([form, 'edit', ...field_path], value, state);
});
