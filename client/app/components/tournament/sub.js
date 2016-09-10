export let __hotReload = true;

import R from 'app/helpers/ramda';
import { fileSub } from 'app/components/file/file';

export function tournamentFileSub() {
  return fileSub([['tournament'], R.assoc('version', 1)]);
}
