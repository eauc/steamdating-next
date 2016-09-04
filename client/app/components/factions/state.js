export let __hotReload = true;

import R from 'app/helpers/ramda';
import httpService from 'app/services/http';
import { registerInit } from 'app/services/init';

export const scope = ['factions'];

registerInit('factions', R.tap(() => {
  httpService.getP({
    onSuccess: ['factions-set'],
    onError: ['error-set', 'factions load failed']
  }, '/data/factions.json');
}));
