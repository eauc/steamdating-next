export let __hotReload = true;

import { effects } from 'app/helpers/middlewares/effects';
import path from 'app/helpers/middlewares/path';
import tap from 'app/helpers/middlewares/tap';
import _httpService_ from 'app/services/http';
import { registerInit } from 'app/services/init';
import stateService from 'app/services/state';
const { registerHandler } = stateService;
import { scope } from 'app/components/factions/state';

registerHandler('factions-init', [
  tap,
  effects,
], () => ({
  http: {
    method: 'GET',
    url: '/data/factions.json',
    onSuccess: { eventName: 'factions-set' },
    onError: {
      eventName: 'toaster-set',
      type: 'error',
      message: 'factions load failed',
    },
  },
}));
registerInit('factions-init', []);

registerHandler('factions-set', [
  path(scope, null),
], (_state_, { httpData: factions }) => factions);
