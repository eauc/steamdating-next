export let __hotReload = true;

import R from 'app/helpers/ramda';
import log from 'app/helpers/log';

const formModel = {
  validate: formValidate,
  isValid: formIsValid,
  fieldValue: formFieldValue,
  fieldError: formFieldError
};
export default R.curryService(formModel);

function formValidate(schema, { edit, base }) {
  log.sub('form edit', edit, schema);
  const validation = schema().validate(edit, { abortEarly: false });
  const {error} = validation;
  log.sub('form validation', validation);
  if(error) {
    error.details = R.groupBy(R.prop('path'), error.details);
  }
  return {edit, base, error};
}

function formIsValid({error}) {
  return !error;
}

function formFieldValue(path, form) {
  return R.path(['edit', ...path], form);
}

function formFieldError(path, form) {
  return R.pathOr('', ['error', 'details', path, 0, 'message'], form);
}
