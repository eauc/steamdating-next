export let __hotReload = true;

import R from 'app/helpers/ramda';
import path from 'app/helpers/middlewares/path';
import stateService from 'app/services/state';
const { registerHandler } = stateService;
import { scope } from 'app/components/form/state';
import formModel from 'app/models/form';

registerHandler('form-reset', [
  path(scope, {}),
], formResetHandler);

registerHandler('form-update', [
  path(scope, {}),
], formUpdateHandler);

export function formResetHandler(state, { formName, value }) {
  return R.assoc(
    formName,
    formModel.create(value),
    state
  );
}

export function formUpdateHandler(state, {
  fieldName, value, updateWith = formModel.updateFieldValue$,
}) {
  const [formName, ...fieldPath] = R.split('.', fieldName);
  console.info(fieldName, formName, fieldPath);
  return R.over(
    R.lensPath([formName, 'edit']),
    updateWith(fieldPath, value),
    state
  );
}
