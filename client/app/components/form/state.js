export let __hotReload = true;

import Joi from 'joi-browser';
import { registerValidator } from 'app/services/state';

export const scope = ['forms'];

const error_schema = Joi.object();
const form_schema = Joi.object({
  edit: Joi.object(),
  base: Joi.object(),
  error: Joi.alternatives().try(null, error_schema)
});
const forms_schema = Joi.object().pattern(/.+/, form_schema);

registerValidator('form', scope, forms_schema);
