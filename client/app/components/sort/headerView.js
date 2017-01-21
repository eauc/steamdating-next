export let __hotReload = true;

import R from 'app/helpers/ramda';
import stateService from 'app/services/state';
const { dispatch } = stateService;
/* eslint-disable no-unused-vars */
import { React, createComponent } from 'app/helpers/react';
import { Icon } from 'app/components/misc/misc';
/* eslint-enable no-unused-vars */

export const SortHeader = createComponent({
  displayName: 'SortHeader',
  render,
  getInitialState,
  doSortBy,
});

function render() {
  const name = this.props.name;
  const label = this.props.label || R.capitalize(name);
  const icon = `chevron-${this.props.sort.reverse ? 'up' : 'down'}`;
  return (
    <th onClick={this.doSortBy}
        title={`Click to Sort by ${label}`}>
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

function getInitialState() {
  return {};
}

function doSortBy() {
  const by = this.props.name;
  let reverse = this.props.sort.reverse;
  if (by === this.props.sort.by) reverse = !reverse;
  else reverse = false;

  dispatch({
    eventName: 'sort-set',
    name: this.props.sortName,
    reverse,
    by,
  });
}
