export let __hotReload = true;

import R from 'app/helpers/ramda';
import log from 'app/helpers/log';
/* eslint-disable no-unused-vars */
import { React, createComponent } from 'app/helpers/react';
import { factionsSub, FactionIcon } from 'app/components/factions/factions';
import { Icon } from 'app/components/misc/misc';
/* eslint-enable no-unused-vars */
import stateService from 'app/services/state';
const { dispatch } = stateService;
import gameModel from 'app/models/game';

export const RoundGameRow = createComponent({
  displayName: 'RoundGameRow',
  render,
  doEditGame,
});

function render() {
  log.cycle('roundGameRow render', this.props, this.state);
  const factions = R.propOr({}, 'factions', this.props);
  const playersFactions = R.propOr({}, 'playersFactions', this.props);
  const game = R.propOr({}, 'game', this.props);
  const [player1, player2] = gameModel.playersNames(game);
  return (
    <tr title="Click to Edit Game"
        onClick={() => this.doEditGame({ game })}>
      <td className="score">{game.player1.score.army}</td>
      <td className="score">{game.player1.score.scenario}</td>
      <td className="score">
        <Icon name={game.player1.score.assassination ? 'check' : ''} />
      </td>
      <td className={{
            win: gameModel.winForPlayer({ name: player1 }, game),
            loss: gameModel.lossForPlayer({ name: player1 }, game),
          }}>
        {R.defaultTo('Phantom', game.player1.name)}
      </td>
      <td className="faction">
        <FactionIcon
           faction={playersFactions[player1]}
           factions={factions} />
      </td>
      <td className="table">
        {R.defaultTo(0, game.table)}
      </td>
      <td className="faction">
        <FactionIcon
           faction={playersFactions[player2]}
           factions={factions} />
      </td>
      <td className={{
            win: gameModel.winForPlayer({ name: player2 }, game),
            loss: gameModel.lossForPlayer({ name: player2 }, game),
          }}>
        {R.defaultTo('Phantom', game.player2.name)}
      </td>
      <td className="score">
        <Icon name={game.player2.score.assassination ? 'check' : ''} />
      </td>
      <td className="score">{game.player2.score.scenario}</td>
      <td className="score">{game.player2.score.army}</td>
    </tr>
  );
}

function doEditGame({ game: { index } }) {
  const roundIndex = this.props.roundIndex;
  const gameIndex = index;
  dispatch({ eventName: 'rounds-startGameEdit', roundIndex, gameIndex });
}
