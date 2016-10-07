export let __hotReload = true;

import R from 'app/helpers/ramda';
import { dispatch,
         registerSubscription,
         getPermanentSubscription } from 'app/services/state';
import { fileSub } from 'app/components/file/file';
import { scope } from 'app/components/tournament/state';

export function tournamentFileSub() {
  return fileSub([scope.tournament, R.assoc('version', 1)]);
}

export const tournamentOnlineListSub = registerSubscription(
  'tournament-onlineList',
  (state) => state
    .map(R.pathOr([], scope.onlineList))
);

export const tournamentOnlineResetSaveFormSub = registerSubscription(
  'tournament-onlineResetSetForm',
  (state) => {
    const defaut = {};
    return state
      .map(R.pathOr(defaut, scope.onlineInfo))
      .map((info) => {
        dispatch(['form-reset', 'tournament_onlineSave', R.pick(['name','date'], info)]);
      });
  }
);

getPermanentSubscription('tournament-onlineInfo', [tournamentOnlineResetSaveFormSub]);
