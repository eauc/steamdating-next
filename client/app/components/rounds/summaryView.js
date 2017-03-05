export let __hotReload = true;

import R from 'app/helpers/ramda';
import { playersListSub } from 'app/components/players/players';
import { roundsSummarySub } from 'app/components/rounds/sub';
/* eslint-disable no-unused-vars */
import { React, createComponent } from 'app/helpers/react';
import { FilterInput } from 'app/components/filter/filter';
import { Icon } from 'app/components/misc/misc';
import { SortHeader } from 'app/components/sort/sort';
/* eslint-enable no-unused-vars */
import stateService from 'app/services/state';
const { dispatch } = stateService;

export const RoundsSummary = createComponent({
  displayName: 'RoundsSummary',
  subscriptions: {
    players: playersListSub,
    summary: roundsSummarySub,
  },
  render,
  getInitialState,
  doEnterNextRound,
  doEditPlayer,
  doEditGame,
});

function render() {
  const roundsHeaders = R.times((index) => (
    <th key={index}>
      Round{index + 1}
    </th>
  ), this.state.summary.nRounds);
  const playersRows = R.map((player) => {
    const gamesColumns = R.mapIndexed((game, index) => (
      <td key={index}
          className={{
            opponent: true,
            win: game.win,
            loss: game.loss,
          }}
          onClick={() => this.doEditGame({ roundIndex: index, gameIndex: game.index })}
          title={`Click to Edit Game${game.win ? `
Win` : ''}${game.loss ? `
Loss` : ''}
Table: ${game.table}
Opponent: ${game.opponent}${game.score.assassination ? `
Assassination` : ''}
Scenario: ${game.score.scenario}
Army: ${game.score.army}`}>
        {R.defaultTo(0, game.table)} - {R.defaultTo('Phantom', game.opponent)}
      </td>
    ), player.games);
    const nbLists = R.length(player.lists.all);
    const nbListsPlayed = R.length(player.lists.played);
    const divideAndConquerOk = (nbListsPlayed >= nbLists);
    return (
      <tr key={player.name}>
        <th className="player"
            onClick={() => this.doEditPlayer(player)}
            title={`Click to Edit Player
Name: ${player.name}
Origin: ${player.origin}
Faction: ${player.faction}
Lists: ${nbLists <= 0 ? '-' : player.lists.all.join(", ")}`}>
          {player.name}
        </th>
        <td className={{
              lists: true,
              ok: divideAndConquerOk,
            }}
            title={`Played: ${nbListsPlayed <= 0 ? '-' : player.lists.played.join(", ")}`}>
          {nbListsPlayed} / {nbLists}
        </td>
        {gamesColumns}
      </tr>
    );
  }, this.state.summary.players);
  const sortIcon = `chevron-${this.state.summary.sort.reverse ? 'up' : 'down'}`;
  return this.state.summary.nRounds === 0 ? (
    <p>
      <button
         className="nextRound"
         type="button"
         onClick={this.doEnterNextRound}>
        Create first round
      </button>
    </p>
  ) : (
    <div>
      <FilterInput name="roundsSummary" />
      <table className="list">
        <thead>
          <tr>
            <SortHeader
               name="name"
               label="Players"
               sortName="roundsSummary"
               sort={this.state.summary.sort} />
            <th>Lists</th>
            {roundsHeaders}
          </tr>
        </thead>
        <tbody>
          {playersRows}
        </tbody>
      </table>
    </div>
  );
}

function getInitialState() {
  return {
    players: [],
    summary: [],
  };
}

function doEnterNextRound() {
  dispatch({ eventName: 'rounds-startCreate' });
}

function doEditPlayer(player) {
  dispatch({ eventName: 'players-startEdit', player });
}

function doEditGame({ roundIndex, gameIndex }) {
  dispatch({ eventName: 'rounds-startGameEdit', roundIndex, gameIndex });
}
