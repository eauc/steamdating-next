export let __hotReload = true;

import Joi from 'joi-browser';
import { registerValidator } from 'app/services/state';

export const scope = ['sorts'];

export const sort_schema = Joi.object({
  reverse: Joi.boolean().required(),
  by: Joi.string().min(1).empty('').required()
});
const sorts_schema = Joi.object().pattern(/.+/, sort_schema);

registerValidator('sort', scope, sorts_schema);
