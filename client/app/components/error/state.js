export let __hotReload = true;

import Joi from 'joi-browser';
import { registerValidator } from 'app/services/state';

export const scope = ['error'];
export const schema = Joi.alternatives(null, Joi.string());

registerValidator('error', scope, schema);
