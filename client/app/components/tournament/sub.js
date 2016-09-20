export let __hotReload = true;

import R from 'app/helpers/ramda';
import { registerSubscription } from 'app/services/state';
import { fileSub } from 'app/components/file/file';
import { scope } from 'app/components/tournament/state';

export function tournamentFileSub() {
  return fileSub([scope.tournament, R.assoc('version', 1)]);
}

export const tournamentOnlineListSub = registerSubscription(
  'tournament-online-list',
  (state) => state
    .map(R.pathOr([], scope.online_list))
);
