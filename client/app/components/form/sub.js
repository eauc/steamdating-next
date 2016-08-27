export let __hotReload = true;

import R from 'app/helpers/ramda';
import log from 'app/helpers/log';
import { registerSubscription } from 'app/services/state';

export const formSub = registerSubscription(
  'form',
  (state, [_sub_, form, schema]) => {
    log.sub('form', form, schema);
    schema = ( (R.type(schema) !== 'Function')
               ? () => schema
               : schema
             );
    return state
      .map(R.pathOr({}, ['forms', form, 'edit']))
      .map((edit) => {
        log.sub('form edit', edit, schema);
        const validation = schema().validate(edit, { abortEarly: false });
        const {error} = validation;
        log.sub('form validation', validation);
        if(error) {
          error.details = R.groupBy(R.prop('path'), error.details);
        }
        return {edit, error};
      });
  }
);

export const formValidSub = registerSubscription(
  'form-valid',
  (_state_, [_name_, form_view]) => {
    return form_view
      .map(({error}) => !error);
  }
);

export const formFieldSub = registerSubscription(
  'form-field',
  (_state_, [_name_, form_view, field]) => {
    const path = R.tail(R.split('.', field));
    log.sub('formField', form_view, field, path);
    return form_view
      .map(R.path(['edit', ...path]));
  }
);

export const formErrorSub = registerSubscription(
  'form-error',
  (_state_, [_name_, form_view, field]) => {
    const path = R.join('.', R.tail(R.split('.', field)));
    log.sub('formError', form_view, field, path);
    return form_view
      .map(R.pathOr('', ['error', 'details', path, 0, 'message']));
  }
);
