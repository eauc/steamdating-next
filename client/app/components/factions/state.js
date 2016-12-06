export let __hotReload = true;

import R from 'app/helpers/ramda';
import httpService from 'app/services/http';
import { registerInit } from 'app/services/init';
import stateService from 'app/services/state';
const { registerValidator } = stateService;

export const scope = ['factions'];

const castersSchema = {
  type: 'object',
  additionnalProperties: { type: 'string' },
};
const factionSchema = {
  type: 'object',
  properties: {
    icon: { type: 'string' },
    casters: castersSchema,
    t3: { type: 'string' },
  },
  required: ['icon', 'casters'],
};
const factionsSchema = {
  type: 'object',
  additionnalProperties: factionSchema,
};

registerInit('factions', [], R.tap(() => {
  httpService.requestP({
    method: 'GET',
    url: '/data/factions.json',
    onSuccess: ['factions-set'],
    onError: [
      'toaster-set', {
        type: 'error',
        message: 'factions load failed',
      },
    ],
  });
}));

registerValidator('factions', scope, factionsSchema);
