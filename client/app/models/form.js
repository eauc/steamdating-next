export let __hotReload = true;

import R from 'app/helpers/ramda';
import log from 'app/helpers/log';
import ajv from 'app/helpers/ajv';

const formModel = {
  create: formCreate,
  validate: formValidate,
  isValid: formIsValid,
  updateFieldValue: formUpdateFieldValue,
  fieldValue: formFieldValue,
  fieldError: formFieldError,
  globalErrors: formGlobalErrors,
};
export default R.curryService(formModel);

function formCreate(value) {
  return {
    base: value,
    edit: value,
  };
}

function formValidate(getSchema, { edit, base }) {
  const schema = getSchema();
  log.form('form edit', edit, schema);
  const validate = ajv.compile(schema);
  const valid = validate(edit);
  log.form('form validation', valid, validate.errors);
  const error = R.exists(validate.errors) ?
          R.groupBy(R.prop('dataPath'), validate.errors) :
          null;
  return { edit, base, error };
}

function formIsValid({ error }) {
  return !error;
}

function formUpdateFieldValue(fieldPath, value, form) {
  return R.updateIn(['edit', ...fieldPath], value, form);
}

function formFieldValue(path, form) {
  return R.pathOr(null, ['edit', ...path], form);
}

function formFieldError(path, form) {
  return R.pathOr('', ['error', `.${path}`, 0, 'message'], form);
}

function formGlobalErrors(form) {
  return R.thread(form)(
    R.pathOr([], ['error', '']),
    R.pluck('message')
  );
}
