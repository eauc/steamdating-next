export let __hotReload = true;

import Joi from 'joi-browser';

export const scope = ['sorts'];

export const schema = {
  sort: Joi.object()
    .keys({ reverse: Joi.boolean().required(),
            by: Joi.string().min(1).empty('').required()
          })
};
