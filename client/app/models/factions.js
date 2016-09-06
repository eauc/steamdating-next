export let __hotReload = true;

import R from 'app/helpers/ramda';

const factionsModel = {
  iconFor: factionsIconFor,
  castersFor: factionsCasterFor
};
export default R.curryService(factionsModel);

function factionsIconFor(name, factions) {
  return `/data/icons/${R.path([name, 'icon'], factions)}`;
}

function factionsCasterFor(name, factions) {
  return R.thread(factions)(
    R.pathOr({}, [name, 'casters']),
    R.keys
  );
}
