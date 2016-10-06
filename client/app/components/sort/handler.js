export let __hotReload = true;

import R from 'app/helpers/ramda';
import Joi from 'joi-browser';
import { registerHandler } from 'app/services/state';
import { scope, sortSchema } from 'app/components/sort/state';
import path from 'app/helpers/middlewares/path';
import stripv from 'app/helpers/middlewares/stripv';
import validateArgs from 'app/helpers/middlewares/validateArgs';

registerHandler(
  'sort-set',
  [path(scope, {}),
   validateArgs([
     Joi.string()
       .min(1)
       .required(),
     sortSchema.required(),
   ]),
   stripv,
  ], (state, [name, value]) => R.assoc(name, value, state)
);
