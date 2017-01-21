export let __hotReload = true;

import R from 'app/helpers/ramda';
import { effects } from 'app/helpers/middlewares/effects';
import tap from 'app/helpers/middlewares/tap';
import stateService from 'app/services/state';
const { registerHandler } = stateService;
import { registerInit } from 'app/services/init';
import { scope as formsScope } from 'app/components/form/state';
import { scope } from 'app/components/rounds/state';
import roundModel from 'app/models/round';
import roundsModel from 'app/models/rounds';

registerHandler('rounds-init', [
  tap,
  effects,
], roundsInitHandler);
registerInit('rounds-init', ['storage-init']);

registerHandler('rounds-createCurrentEdit', [
  effects,
], roundsCreateCurrentEditHandler);

export function roundsInitHandler(state) {
  return {
    dispatch: {
      eventName: 'form-reset',
      formName: 'round',
      value: roundModel.create(
        { players: R.pathOr([], ['tournament','players'], state) },
        {}
        // R.pathOr({}, ['forms','round','edit'], state)
      ),
    },
  };
}

export function roundsCreateCurrentEditHandler(state) {
  const edit = R.pathOr({}, [...formsScope, 'round','edit'], state);
  return {
    state: R.over(R.lensPath(scope), roundsModel.add$(edit), state),
    dispatch: {
      eventName: 'form-reset',
      formName: 'round',
      value: roundModel.create(
        { players: R.pathOr([], ['tournament','players'], state) },
        {}
      ),
    },
  };
}