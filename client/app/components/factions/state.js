export let __hotReload = true;

import R from 'app/helpers/ramda';
import Joi from 'joi-browser';

import httpService from 'app/services/http';
import { registerInit } from 'app/services/init';
import { registerValidator } from 'app/services/state';

export const scope = ['factions'];

const caster_schema = Joi.object().pattern(/.+/, Joi.string());
const faction_schema = Joi.object({
  icon: Joi.string(),
  casters: caster_schema,
  t3: Joi.string()
});
const factions_schema = Joi.object().pattern(/.+/, faction_schema);

registerInit('factions', R.tap(() => {
  httpService.getP({
    onSuccess: ['factions-set'],
    onError: ['toaster-set', { type: 'error',
                               message: 'factions load failed' }]
  });
}));

registerValidator('factions', scope, factions_schema);
