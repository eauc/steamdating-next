export let __hotReload = true;

import stateService from 'app/services/state';
const { registerValidator } = stateService;

export const scope = ['forms'];

const formSchema = {
  type: 'object',
  properties: {
    edit: { type: 'object' },
    base: { type: 'object' },
    error: { oneOf: [{ type: 'null' }, { type: 'object' }] },
  },
};

const formsSchema = {
  type: 'object',
  additionnalProperties: formSchema,
};

registerValidator('form', scope, formsSchema);
