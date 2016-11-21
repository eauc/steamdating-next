export let __hotReload = true;

import { registerValidator } from 'app/services/state';

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
