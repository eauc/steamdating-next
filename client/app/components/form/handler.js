export let __hotReload = true;

import R from 'app/helpers/ramda';
import path from 'app/helpers/middlewares/path';
import stripv from 'app/helpers/middlewares/stripv';
import { registerHandler } from 'app/services/state';
import { scope } from 'app/components/form/state';
import formModel from 'app/models/form';

const middlewares = [
  path(scope, {}),
  stripv,
];

registerHandler(
  'form-reset',
  middlewares,
  (state, [form, value]) => R.assoc(form, formModel.create(value), state)
);

registerHandler(
  'form-update',
  middlewares,
  (state, [formFieldName, value]) => {
    const [form, ...fieldPath] = R.split('.', formFieldName);
    return R.over(
      R.lensProp(form),
      formModel.updateFieldValue$(fieldPath, value),
      state
    );
  }
);
