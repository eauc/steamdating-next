export let __hotReload = true;

import { registerValidator } from 'app/services/state';

export const scope = ['toaster'];

export const typeSchema = {
  enum: ['success', 'warning', 'error', 'info'],
};
export const messageSchema = { type: 'string' };
export const toasterSchema = {
  oneOf: [
    { type: 'null' },
    {
      type: 'object',
      properties: {
        type: typeSchema,
        message: messageSchema,
      },
      required: ['type', 'message'],
    },
  ],
};

registerValidator('toaster', scope, toasterSchema);
