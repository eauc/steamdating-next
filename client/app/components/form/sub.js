export let __hotReload = true;

import R from 'app/helpers/ramda';
import stateService from 'app/services/state';
const { registerSubscription } = stateService;
import { scope } from 'app/components/form/state';
import formModel from 'app/models/form';

export const formSub = registerSubscription(
  'form',
  (stateCell, [_sub_, form]) => stateCell
    .map(R.pathOr({}, [...scope, form]))
);

export const formValidateSub = registerSubscription(
  'form-validate',
  (_stateCell_, [_sub_, form, schema]) => {
    let schemaFn = ( (R.type(schema) !== 'Function')
                    ? () => schema
                    : schema
                  );
    return formSub([form])
      .map(formModel.validate$(schemaFn));
  }
);

export const formValidSub = registerSubscription(
  'form-valid',
  (_state_, [_name_, formView]) => formView
    .map(formModel.isValid)
);

export const formFieldSub = registerSubscription(
  'form-field',
  (_state_, [_name_, formView, field]) => {
    const path = R.tail(R.split('.', field));
    return formView.map(formModel.fieldValue$(path));
  }
);

export const formErrorSub = registerSubscription(
  'form-error',
  (_state_, [_name_, formView, field]) => {
    const path = R.join('.', R.tail(R.split('.', field)));
    return formView.map(formModel.fieldError$(path));
  }
);
