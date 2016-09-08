export let __hotReload = true;

import R from 'app/helpers/ramda';
import log from 'app/helpers/log';
import React from 'react';
import styles from 'app/helpers/styles';
import pureRenderMixin from 'react-addons-pure-render-mixin';
import subscriptionsMixin from 'app/mixins/subscriptions';
import { dispatch } from 'app/services/state';
import { filterSub } from 'app/components/filter/filter';

export const FilterInput = styles.decorator(React.createClass({
  displayName: 'FilterInput',
  mixins: [ subscriptionsMixin, pureRenderMixin ],
  subscriptions: {
    filter: filterInputGetSubscription
  },
  render: filterInputRender,
  getInitialState: filterInputGetInitialState,
  onFilterUpdate: filterInputOnUpdate,
  dispatchFilterUpdate: filterInputDispatchUpdate
}));

function filterInputRender() {
  log.cycle('filterInput', this.state, this.props);
  const id = `${this.props.name}.filter`;
  return (
    <input id={id}
           name={id}
           type="text"
           value={this.state.filter}
           onChange={this.onFilterUpdate}
           placeholder="Filter" />
  );
}

function filterInputGetSubscription() {
  return filterSub([this.props.name]);
}

function filterInputGetInitialState() {
  this.onFilterUpdate = R.bind(this.onFilterUpdate, this);
  this.dispatchFilterUpdate = R.debounce(500, R.bind(this.dispatchFilterUpdate, this));
  return { filter: '' };
}

function filterInputOnUpdate(e) {
  this.setState({ filter: e.target.value });
  this.dispatchFilterUpdate(e.target.value);
}

function filterInputDispatchUpdate(value) {
  dispatch(['filter-set', this.props.name, value]);
}
