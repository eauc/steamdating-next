export let __hotReload = true;

import R from 'app/helpers/ramda';
import { fileSub } from 'app/components/file/file';
import { scope } from 'app/components/tournament/state';

export function tournamentFileSub() {
  return fileSub([scope, R.assoc('version', 1)]);
}
