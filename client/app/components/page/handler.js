export let __hotReload = true;

import path from 'app/helpers/middlewares/path';
import stripv from 'app/helpers/middlewares/stripv';
import { registerHandler } from 'app/services/state';

registerHandler('page-set', [
  path(['page'], null),
  stripv,
], pageSetHandler);

export function pageSetHandler(_state_, [page]) {
  return page;
}
