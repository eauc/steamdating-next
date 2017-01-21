export let __hotReload = true;

/* eslint-disable no-unused-vars */
import { React, createComponent } from 'app/helpers/react';
import { sortSub, SortHeader } from 'app/components/sort/sort';
/* eslint-enable no-unused-vars */

export const RoundHeader = createComponent({
  displayName: 'RoundHeader',
  subscriptions: {
    sort: [sortSub, 'round', 'table'],
  },
  render,
  getInitialState,
});

function render() {
  console.debug('roundHeader render', this.props, this.state);
  return (
    <tr>
      <th className="score">AP</th>
      <th className="score">CP</th>
      <th className="score">CK</th>
      <SortHeader name="player1.name"
                  label="Player1"
                  sortName="round"
                  sort={this.state.sort} />
      <th className="faction"></th>
      <SortHeader name="table"
                  sortName="round"
                  sort={this.state.sort} />
      <th className="faction"></th>
      <SortHeader name="player2.name"
                  label="Player2"
                  sortName="round"
                  sort={this.state.sort} />
      <th className="score">CK</th>
      <th className="score">CP</th>
      <th className="score">AP</th>
    </tr>
  );
}

function getInitialState() {
  return {};
}
