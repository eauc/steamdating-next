export let __hotReload = true;

import stateService from 'app/services/state';
const { registerValidator } = stateService;

export const scope = ['filters'];

const filtersSchema = {
  type: 'object',
  additionnalProperties: { type: 'string' },
};

registerValidator('filter', scope, filtersSchema);
