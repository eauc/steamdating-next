export let __hotReload = true;

import R from 'app/helpers/ramda';
/* eslint-disable no-unused-vars */
import { React, createComponent } from 'app/helpers/react';
import { FactionIcon } from 'app/components/factions/factions';
import { FormInput } from 'app/components/form/form';
/* eslint-enable no-unused-vars */
import gameModel from 'app/models/game';

export const RoundGamesEdit = createComponent({
  displayName: 'RoundGamesEdit',
  render,
});

function render() {
  console.debug('roundGamesEdit', this.props, this.state, this.context);
  const games = R.propOr([], 'games', this.props);
  const playersFactions = R.propOr({}, 'playersFactions', this.props);
  const gamesViews = R.times((index) => {
    const isMirror = gameModel.isMirror({ playersFactions }, games[index]);
    return (
      <tr key={index}>
        <td>
          <FormInput name={`games.${index}.player1.name`}
                     type="select"
                     options={this.props.playersNames}
                     order={index * 3 + 1} />
        </td>
        <td className={{
              faction: true,
              warning: isMirror,
            }}>
          <FactionIcon
             faction={playersFactions[games[index].player1.name]}
             factions={this.props.factions} />
        </td>
        <td className="table">
          <FormInput name={`games.${index}.table`}
                     type="number"
                     order={index * 3 + 2} />
        </td>
        <td className={{
              faction: true,
              warning: isMirror,
            }}>
          <FactionIcon
             faction={playersFactions[games[index].player2.name]}
             factions={this.props.factions} />
        </td>
        <td>
          <FormInput name={`games.${index}.player2.name`}
                     type="select"
                     options={this.props.playersNames}
                     order={index * 3 + 3} />
        </td>
      </tr>
    );
  }, R.length(games));
  return (
    <tbody>
      {gamesViews}
    </tbody>
  );
}
