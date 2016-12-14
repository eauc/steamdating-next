export let __hotReload = true;

import R from 'app/helpers/ramda';
import log from 'app/helpers/log';
import stateService from 'app/services/state';
const { dispatch } = stateService;
import { filterSub } from 'app/components/filter/filter';
/* eslint-disable no-unused-vars */
import { React, createComponent } from 'app/helpers/react';
/* eslint-enable no-unused-vars */

export const FilterInput = createComponent({
  displayName: 'FilterInput',
  subscriptions: {
    filter: filterInputGetSubscription,
  },
  render: filterInputRender,
  getInitialState: filterInputGetInitialState,
  doFilterUpdate: filterInputDoUpdate,
  dispatchFilterUpdate: filterInputDispatchUpdate,
});

function filterInputRender() {
  log.cycle('filterInput', this.state, this.props);
  const id = `${this.props.name}.filter`;
  return (
    <input id={id}
           name={id}
           type="text"
           value={this.state.filter}
           onChange={this.doFilterUpdate}
           placeholder="Filter" />
  );
}

function filterInputGetSubscription() {
  return filterSub([this.props.name]);
}

function filterInputGetInitialState() {
  this.dispatchFilterUpdate = R.debounce(
    200,
    R.bind(this.dispatchFilterUpdate, this)
  );
  return { filter: '' };
}

function filterInputDoUpdate(event) {
  this.setState({ filter: event.target.value });
  this.dispatchFilterUpdate(event.target.value);
}

function filterInputDispatchUpdate(value) {
  dispatch({
    eventName: 'filter-set',
    name: this.props.name,
    value,
  });
}
