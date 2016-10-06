export let __hotReload = true;

import R from 'app/helpers/ramda';
import Joi from 'joi-browser';

import httpService from 'app/services/http';
import { registerInit } from 'app/services/init';
import { registerValidator } from 'app/services/state';

export const scope = ['factions'];

const casterSchema = Joi.object().pattern(/.+/, Joi.string());
const factionSchema = Joi.object({
  icon: Joi.string(),
  casters: casterSchema,
  t3: Joi.string(),
});
const factionsSchema = Joi.object().pattern(/.+/, factionSchema);

registerInit('factions', [], R.tap(() => {
  httpService.getP({
    url: '/data/factions.json',
    onSuccess: ['factions-set'],
    onError: ['toaster-set', { type: 'error',
                               message: 'factions load failed' }],
  });
}));

registerValidator('factions', scope, factionsSchema);
