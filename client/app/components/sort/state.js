export let __hotReload = true;

import Joi from 'joi-browser';
import { registerValidator } from 'app/services/state';

export const scope = ['sorts'];

export const sortSchema = Joi.object({
  reverse: Joi.boolean().required(),
  by: Joi.string()
    .min(1)
    .empty('')
    .required(),
});

const sortsSchema = Joi.object().pattern(/.+/, sortSchema);

registerValidator('sort', scope, sortsSchema);
