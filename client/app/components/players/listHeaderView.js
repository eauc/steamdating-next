export let __hotReload = true;

import R from 'app/helpers/ramda';
import stateService from 'app/services/state';
const { dispatch } = stateService;
/* eslint-disable no-unused-vars */
import { React, createComponent } from 'app/helpers/react';
import { Icon } from 'app/components/misc/misc';
/* eslint-enable no-unused-vars */

export const PlayersListHeader = createComponent({
  displayName: 'PlayersListHeader',
  render: playersListHeaderRender,
  getInitialState: playersListHeaderGetInitialState,
  doSortBy: playersListDoSortBy,
});

function playersListHeaderRender() {
  const name = this.props.name;
  const label = this.props.label || R.capitalize(name);
  const icon = `chevron-${this.props.sort.reverse ? 'up' : 'down'}`;
  return (
    <th onClick={this.doSortBy}>
      <span>{label} </span>
      <span className={{
              icon: true,
              'icon-show': this.props.sort.by === name,
            }}>
        <Icon name={icon} />
      </span>
    </th>
  );
}

function playersListHeaderGetInitialState() {
  return {};
}

function playersListDoSortBy() {
  const by = this.props.name;
  let reverse = this.props.sort.reverse;
  if (by === this.props.sort.by) reverse = !reverse;
  else reverse = false;

  dispatch(['sort-set', 'players', { reverse, by }]);
}
