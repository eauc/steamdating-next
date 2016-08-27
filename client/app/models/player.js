export let __hotReload = true;

import R from 'app/helpers/ramda';

const playerModel = {
  create: playerCreate
};

export default R.curryService(playerModel);

function playerCreate(create) {
  return R.deepMerge([create], {
    name: null,
    origin: null,
    faction: null,
    lists: [],
    team: null,
    notes: null,
    custom_field: 0,
    droped: null
  });
}
