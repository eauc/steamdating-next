export let __hotReload = true;

import { coeffects } from 'app/helpers/middlewares/coeffects';
import tap from 'app/helpers/middlewares/tap';
import stateService from 'app/services/state';
const { registerHandler } = stateService;

registerHandler('navigate', [
  tap,
  coeffects(['history']),
], navigateHandler);

registerHandler('navigate-back', [
  tap,
  coeffects(['history']),
], navigateBackHandler);

export function navigateHandler({ history }, { to }) {
  history.push(to);
}

export function navigateBackHandler({ history }) {
  history.goBack();
}
