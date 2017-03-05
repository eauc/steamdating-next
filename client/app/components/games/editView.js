export let __hotReload = true;

import R from 'app/helpers/ramda';
import { gameSchema } from 'app/components/games/state';
import { gamesEditSub } from 'app/components/games/sub';
import { playersSub } from 'app/components/players/players';
/* eslint-disable no-unused-vars */
import { React, createComponent } from 'app/helpers/react';
import { factionsSub, FactionIcon } from 'app/components/factions/factions';
import { FormEdit, FormInput } from 'app/components/form/form';
import { GameWinLossEdit } from 'app/components/games/winLossEditView';
/* eslint-enable no-unused-vars */
import playersModel from 'app/models/players';
// import gameModel from 'app/models/game';

export const GameEdit = createComponent({
  displayName: 'GameEdit',
  subscriptions: {
    factions: factionsSub,
    gameEdit: gamesEditSub,
    players: playersSub,
  },
  render,
  getInitialState,
});

function render() {
  console.debug('gameEdit render', this.state);
  const playersNames = playersModel.names(this.state.players);
  return (
    <FormEdit name="game"
              label="Edit Game"
              schema={gameSchema}
              onSubmit={this.props.onSubmit}>
      <table className="gamesList">
        <thead>
          <tr>
            <th>
              Player1
            </th>
            <th className="faction">
            </th>
            <th className="table">
              Table
            </th>
            <th className="faction">
            </th>
            <th>
              Player2
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <FormInput
                 name="player1.name"
                 type="select"
                 options={playersNames}
                 order="1" />
            </td>
            <td className="faction">
              <FactionIcon
                 faction={R.pathOr('', ['gameEdit','player1','faction'], this.state)}
                 factions={this.state.factions} />
            </td>
            <td className="table">
              <FormInput
                 name="table"
                 type="number"
                 order="2" />
            </td>
            <td className="faction">
              <FactionIcon
                 faction={R.pathOr('', ['gameEdit','player2','faction'], this.state)}
                 factions={this.state.factions} />
            </td>
            <td>
              <FormInput
                 name="player2.name"
                 type="select"
                 options={playersNames}
                 order="3" />
            </td>
          </tr>
          <tr>
            <td>
              <FormInput
                 name="player1.list"
                 type="select"
                 options={R.pathOr([], ['gameEdit','player1','lists'], this.state)}
                 order="4" />
            </td>
            <td className="faction">
            </td>
            <th>
              List
            </th>
            <td className="faction">
            </td>
            <td>
              <FormInput
                 name="player2.list"
                 type="select"
                 options={R.pathOr([], ['gameEdit','player2','lists'], this.state)}
                 order="5" />
            </td>
          </tr>
          <tr>
            <GameWinLossEdit
               name="player1.score.tournament" />
            <td className="faction">
            </td>
            <th>
            </th>
            <td className="faction">
            </td>
            <GameWinLossEdit
               name="player2.score.tournament" />
          </tr>
          <tr>
            <td className="ck">
              <FormInput
                 label="Assassination"
                 name="player1.score.assassination"
                 type="checkbox"
                 order="6" />
            </td>
            <td className="faction">
            </td>
            <th>
              CK
            </th>
            <td className="faction">
            </td>
            <td className="ck">
              <FormInput
                 label="Assassination"
                 name="player2.score.assassination"
                 type="checkbox"
                 order="7" />
            </td>
          </tr>
          <tr>
            <td>
              <FormInput
                 name="player1.score.scenario"
                 type="number"
                 order="8" />
            </td>
            <td className="faction">
            </td>
            <th>
              CP
            </th>
            <td className="faction">
            </td>
            <td>
              <FormInput
                 name="player2.score.scenario"
                 type="number"
                 order="9" />
            </td>
          </tr>
          <tr>
            <td>
              <FormInput
                 name="player1.score.army"
                 type="number"
                 order="10" />
            </td>
            <td className="faction">
            </td>
            <th>
              AP
            </th>
            <td className="faction">
            </td>
            <td>
              <FormInput
                 name="player2.score.army"
                 type="number"
                 order="11" />
            </td>
          </tr>
        </tbody>
      </table>
    </FormEdit>
  );
}

function getInitialState() {
  return {
    factions: [],
    gameEdit: {},
    players: [],
  };
}
