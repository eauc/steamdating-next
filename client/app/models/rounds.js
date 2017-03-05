export let __hotReload = true;

import R from 'app/helpers/ramda';
import roundModel from 'app/models/round';

const roundsModel = {
  add,
  remove,
  updateGame,
  renamePlayer,
  round,
  playerSummary,
};

export default R.curryService(roundsModel);

function add(addRound, rounds) {
  return R.append(addRound, rounds);
}

function remove({ index }, rounds) {
  return R.remove(index, 1, rounds);
}

function updateGame({ game, roundIndex, gameIndex }, rounds) {
  return R.adjust(
    roundModel.updateGame$({ game, gameIndex }),
    roundIndex,
    rounds
  );
}

function renamePlayer({ oldName, newName }, rounds) {
  return R.map(roundModel.renamePlayer$({ oldName, newName }), rounds);
}

function round({ index }, rounds) {
  return R.nth(index, rounds);
}

function playerSummary({ player }, rounds) {
  const games = R.map(roundModel.playerResult$({ player }), rounds);
  return {
    name: player.name,
    origin: player.origin,
    faction: player.faction,
    lists: {
      all: player.lists,
      played: R.filter(R.exists, R.map(R.prop('list'), games)),
    },
    games,
  };
}
