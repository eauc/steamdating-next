export let __hotReload = true;

import R from 'ramda';
import { capitalize } from 'app/helpers/ramda/capitalize';
import { curryService } from 'app/helpers/ramda/curryService';
import { debounce } from 'app/helpers/ramda/debounce';
import { deepMerge, deepMergeObject, deepMergeArray } from 'app/helpers/ramda/deepMerge';
import { dissocIn } from 'app/helpers/ramda/dissocIn';
import { dropIndex } from 'app/helpers/ramda/dropIndex';
import { exists } from 'app/helpers/ramda/exists';
import { jsonParse, jsonStringify } from 'app/helpers/ramda/json';
import { lensPropOr, lensPathOr } from 'app/helpers/ramda/lensOr';
import { spy } from 'app/helpers/ramda/spy';
import { thread, threadP } from 'app/helpers/ramda/thread';
import { updateIn } from 'app/helpers/ramda/updateIn';

export default R.pipe(
  R.assoc('capitalize', capitalize),
  R.assoc('curryService', curryService),
  R.assoc('debounce', debounce),
  R.assoc('deepMerge', deepMerge),
  R.assoc('deepMergeArray', deepMergeArray),
  R.assoc('deepMergeObject', deepMergeObject),
  R.assoc('dissocIn', dissocIn),
  R.assoc('dropIndex', dropIndex),
  R.assoc('exists', exists),
  R.assoc('jsonParse', jsonParse),
  R.assoc('jsonStringify', jsonStringify),
  R.assoc('lensPathOr', lensPathOr),
  R.assoc('lensPropOr', lensPropOr),
  R.assoc('spy', spy),
  R.assoc('thread', thread),
  R.assoc('threadP', threadP),
  R.assoc('updateIn', updateIn)
)(R);
