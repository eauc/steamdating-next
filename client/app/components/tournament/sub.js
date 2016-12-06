export let __hotReload = true;

import R from 'app/helpers/ramda';
import stateService from 'app/services/state';
const { registerSubscription } = stateService;
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
