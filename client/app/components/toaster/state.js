export let __hotReload = true;

import Joi from 'joi-browser';
import { registerValidator } from 'app/services/state';

export const scope = ['toaster'];

export const typeSchema = Joi.string()
  .valid(['success', 'warning', 'error', 'info']);
export const messageSchema = Joi.string()
  .empty('');
export const toasterSchema = Joi.alternatives(null, Joi.object({
  type: typeSchema.required(),
  message: messageSchema.required(),
}));

registerValidator('toaster', scope, toasterSchema);
