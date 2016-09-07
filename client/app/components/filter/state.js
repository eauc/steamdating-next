export let __hotReload = true;

import Joi from 'joi-browser';
import { registerValidator } from 'app/services/state';

export const scope = ['filters'];

registerValidator('filter', scope, Joi.object());
