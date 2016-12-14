export let __hotReload = true;

import R from 'app/helpers/ramda';
import ajv from 'app/helpers/ajv';
import log from 'app/helpers/log';
import stateService from 'app/services/state';
const { dispatch } = stateService;

export default R.curry(function validateArgs(properties, handler) {
  const argsSchema = {
    type: 'object',
    properties: R.reduce(
      (mem, key) => R.assoc(key, typeStringToSchema(properties[key]), mem),
      { eventName: { type: 'string' } },
      R.keys(properties)
    ),
    additionnalProperties: false,
  };
  const validate = ajv.compile(argsSchema);
  return function (state, event) {
    const { eventName } = event;
    const valid = validate(event);
    if (valid) return handler(state, event);

    log.error('Args validation error', event, validate.errors);
    if (!eventName.startsWith('toaster')) {
      dispatch({
        eventName: 'toaster-set',
        type: 'error',
        message: 'Invalid arguments',
      });
    }
    return state;
  };
});

function typeStringToSchema(typeStringOrSchema) {
  return R.type(typeStringOrSchema) === 'String' ?
    { type: typeStringOrSchema } :
  typeStringOrSchema;
}
