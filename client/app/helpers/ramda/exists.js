export let __hotReload = true;

import R from 'ramda';

export const exists = R.complement(R.isNil);
