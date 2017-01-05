export let __hotReload = true;

import R from 'app/helpers/ramda';

const gameModel = {
  create,
  resetPlayer,
  playersNames,
  isMirror,
};

export default R.curryService(gameModel);

function create(base = {}) {
  return R.deepMerge([base], {
    table: null,
    player1: {
      name: null,
      list: null,
      score: {
        assassination: false,
        scenario: 0,
        army: 0,
        custom: 0,
      },
    },
    player2: {
      name: null,
      list: null,
      score: {
        assassination: false,
        scenario: 0,
        army: 0,
        custom: 0,
      },
    },
  });
}

function resetPlayer({ name }, game) {
  return R.thread(game)(
    R.over(R.lensPath(['player1','name']), R.when(R.equals(name), () => null)),
    R.over(R.lensPath(['player2','name']), R.when(R.equals(name), () => null))
  );
}

function playersNames(game) {
  return [
    R.path(['player1','name'], game),
    R.path(['player2','name'], game),
  ];
}

function isMirror({ playersFactions }, game) {
  return (
    R.exists(game.player1.name) &&
      R.exists(game.player2.name) &&
      playersFactions[game.player1.name] === playersFactions[game.player2.name]
  );
}
