export let __hotReload = true;

import Joi from 'joi-browser';

export const scope = ['prompt'];
export const schema = Joi.alternatives(null, Joi.object().keys({
  type: Joi.string().valid(['alert','prompt','confirm']).required(),
  msg: Joi.string().min(1).required(),
  value: Joi.any(),
  onOk: Joi.array().ordered(Joi.string().required()).items(Joi.any()).required(),
  onCancel: Joi.array().ordered(Joi.string().required()).items(Joi.any())
}));
