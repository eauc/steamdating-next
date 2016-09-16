export let __hotReload = true;

import Joi from 'joi-browser';
import { registerValidator } from 'app/services/state';

export const scope = ['toaster'];

export const type_schema = Joi.string()
  .valid(['success', 'warning', 'error', 'info']);
export const message_schema = Joi.string()
  .empty('');
export const toaster_schema = Joi.alternatives(null, Joi.object({
  type: type_schema.required(),
  message: message_schema.required()
}));

registerValidator('toaster', scope, toaster_schema);
