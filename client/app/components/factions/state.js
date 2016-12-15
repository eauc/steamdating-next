export let __hotReload = true;

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

registerValidator('factions', scope, factionsSchema);
