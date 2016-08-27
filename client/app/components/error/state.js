export let __hotReload = true;

import Joi from 'joi-browser';

export const scope = ['error'];
export const schema = Joi.alternatives(null, Joi.string());
