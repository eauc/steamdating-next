export let __hotReload = true;

import Joi from 'joi-browser';
import { registerValidator } from 'app/services/state';

export const scope = ['forms'];

const errorSchema = Joi.object();
const formSchema = Joi.object({
  edit: Joi.object(),
  base: Joi.object(),
  error: Joi.alternatives().try(null, errorSchema),
});
const formsSchema = Joi.object().pattern(/.+/, formSchema);

registerValidator('form', scope, formsSchema);
