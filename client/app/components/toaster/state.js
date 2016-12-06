export let __hotReload = true;

import stateService from 'app/services/state';
const { registerValidator } = stateService;

export const scope = ['toaster'];

export const typeSchema = {
  enum: ['success', 'warning', 'error', 'info'],
};
export const messageSchema = { type: 'string' };
export const toasterSchema = {
  type: 'object',
  properties: {
    type: typeSchema,
    message: messageSchema,
  },
  required: ['type', 'message'],
};

registerValidator('toaster', scope, toasterSchema);
