export let __hotReload = true;

import R from 'app/helpers/ramda';

const gameModel = {
  create,
  resetPlayer,
  renamePlayer,
  setWinLoss,
  isMirror,
  playersNames,
  listForPlayer,
  opponentForPlayer,
  winForPlayer,
  lossForPlayer,
  scoreForPlayer,
};

export default R.curryService(gameModel);

function create(base = {}) {
  return R.deepMerge([base], {
    table: null,
    player1: {
      name: null,
      list: null,
      score: {
        tournament: null,
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
        tournament: null,
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

function renamePlayer({ oldName, newName }, game) {
  return R.thread(game)(
    R.when(
      R.pathEq(['player1','name'], oldName),
      R.assocPath(['player1','name'], newName)
    ),
    R.when(
      R.pathEq(['player2','name'], oldName),
      R.assocPath(['player2','name'], newName)
    )
  );
}

function setWinLoss(fieldPath, value, game) {
  const oldValue = R.path(fieldPath, game);
  if (oldValue === value) return game;
  if (value === 0) return R.assocPath(fieldPath, 0, game);

  const [player, ...path] = fieldPath;
  const otherPlayer = (player === 'player1') ? 'player2' : 'player1';
  return R.thread(game)(
    R.assocPath(fieldPath, 1),
    R.assocPath([otherPlayer, ...path], 0)
  );
}

function isMirror({ playersFactions }, game) {
  return (
    R.exists(game.player1.name) &&
      R.exists(game.player2.name) &&
      playersFactions[game.player1.name] === playersFactions[game.player2.name]
  );
}

function playersNames(game) {
  return [
    R.path(['player1','name'], game),
    R.path(['player2','name'], game),
  ];
}

function listForPlayer({ name }, game) {
  const player1List = (
    game.player1.name === name
      ? game.player1.list
      : null
  );
  const player2List = (
    game.player2.name === name
      ? game.player2.list
      : null
  );
  return player1List || player2List;
}

function opponentForPlayer({ name }, game) {
  const player1Opponent = (
    game.player1.name === name
      ? game.player2.name
      : null
  );
  const player2Opponent = (
    game.player2.name === name
      ? game.player1.name
      : null
  );
  return player1Opponent || player2Opponent;
}

function winForPlayer({ name }, game) {
  const player1Win = (
    game.player1.name === name &&
      game.player1.score.tournament === 1
  );
  const player2Win = (
    game.player2.name === name &&
      game.player2.score.tournament === 1
  );
  return player1Win || player2Win;
}

function lossForPlayer({ name }, game) {
  const player1Loss = (
    game.player1.name === name &&
      game.player1.score.tournament === 0
  );
  const player2Loss = (
    game.player2.name === name &&
      game.player2.score.tournament === 0
  );
  return player1Loss || player2Loss;
}

function scoreForPlayer({ name }, game) {
  const player1Score = (
    game.player1.name === name
      ? game.player1.score
      : null
  );
  const player2Score = (
    game.player2.name === name
      ? game.player2.score
      : null
  );
  return player1Score || player2Score;
}
