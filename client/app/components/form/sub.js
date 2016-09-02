export let __hotReload = true;

import R from 'app/helpers/ramda';
import { registerSubscription } from 'app/services/state';
import { scope } from 'app/componens/form/state';
import formModel from 'app/models/form';

export const formSub = registerSubscription(
  'form',
  (state, [_sub_, form, schema]) => {
    schema = ( (R.type(schema) !== 'Function')
               ? () => schema
               : schema
             );
    return state
      .map(R.pathOr({}, [...scope, form]))
      .map(formModel.validate$(schema));
  }
);

export const formValidSub = registerSubscription(
  'form-valid',
  (_state_, [_name_, form_view]) => {
    return form_view.map(formModel.isValid);
  }
);

export const formFieldSub = registerSubscription(
  'form-field',
  (_state_, [_name_, form_view, field]) => {
    const path = R.tail(R.split('.', field));
    return form_view.map(formModel.fieldValue$(path));
  }
);

export const formErrorSub = registerSubscription(
  'form-error',
  (_state_, [_name_, form_view, field]) => {
    const path = R.join('.', R.tail(R.split('.', field)));
    return form_view.map(formModel.fieldError$(path));
  }
);
