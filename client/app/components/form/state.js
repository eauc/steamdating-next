export let __hotReload = true;

import { registerValidator } from 'app/services/state';

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
