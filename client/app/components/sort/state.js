export let __hotReload = true;

import stateService from 'app/services/state';
const { registerValidator } = stateService;

export const scope = ['sorts'];

export const sortSchema = {
  type: 'object',
  properties: {
    reverse: { type: 'boolean' },
    by: {
      type: 'string',
      minLength: 1,
    },
  },
  required: ['reverse', 'by'],
};

const sortsSchema = {
  type: 'object',
  additionnalProperties: sortSchema,
};

registerValidator('sort', scope, sortsSchema);
