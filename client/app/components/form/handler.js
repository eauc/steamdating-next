export let __hotReload = true;

import R from 'app/helpers/ramda';
import path from 'app/helpers/middlewares/path';
import stateService from 'app/services/state';
const { registerHandler } = stateService;
import { scope } from 'app/components/form/state';
import formModel from 'app/models/form';

registerHandler('form-reset', [
  path(scope, {}),
], (state, { formName, value }) => R.assoc(
  formName,
  formModel.create(value),
  state
));

registerHandler('form-update', [
  path(scope, {}),
], (state, { fieldName, value }) => {
  const [formName, ...fieldPath] = R.split('.', fieldName);
  return R.over(
    R.lensProp(formName),
    formModel.updateFieldValue$(fieldPath, value),
    state
  );
});
