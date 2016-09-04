export let __hotReload = true;

import R from 'app/helpers/ramda';

const factionsModel = {
  iconFor: factionsIconFor
};
export default R.curryService(factionsModel);

function factionsIconFor(name, factions) {
  return `/data/icons/${R.path([name, 'icon'], factions)}`;
}
