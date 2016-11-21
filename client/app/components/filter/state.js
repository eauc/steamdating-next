export let __hotReload = true;

import { registerValidator } from 'app/services/state';

export const scope = ['filters'];

const filtersSchema = {
  type: 'object',
  additionnalProperties: { type: 'string' },
};

registerValidator('filter', scope, filtersSchema);
