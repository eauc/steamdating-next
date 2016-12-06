export let __hotReload = true;

import R from 'app/helpers/ramda';
import ajv from 'app/helpers/ajv';
import log from 'app/helpers/log';
import stateService from 'app/services/state';
const { dispatch } = stateService;

export default R.curry(function validateArgs(schemaOrArray, handler) {
  const argsSchema = (
    R.type(schemaOrArray) === 'Array'
      ? { type: 'array', items: R.map(typeStringToSchema, schemaOrArray), additionnalItems: false }
    : schemaOrArray
  );
  const validate = ajv.compile(argsSchema);
  return function (state, [event, ...args]) {
    const valid = validate(args);
    if (valid) return handler(state, [event, ...args]);

    log.error('Args validation error', args, validate.errors);
    if (!event.startsWith('toaster')) {
      dispatch(['toaster-set', {
        type: 'error',
        message: 'Invalid arguments',
      }]);
    }
    return state;
  };
});

function typeStringToSchema(typeStringOrSchema) {
  return R.type(typeStringOrSchema) === 'String' ?
    { type: typeStringOrSchema } :
  typeStringOrSchema;
}
