export let __hotReload = true;

import R from 'app/helpers/ramda';
import stateService from 'app/services/state';
const { dispatch } = stateService;
/* eslint-disable no-unused-vars */
import { React, createComponent } from 'app/helpers/react';
import { Icon } from 'app/components/misc/misc';
/* eslint-enable no-unused-vars */

export const DebugStateValue = createComponent({
  displayName: 'DebugStateValue',
  getInitialState: debugStateValueGetInitialState,
  render: debugStateValueRender,
  doChange: debugStateValueDoChange,
  doRemove: debugStateValueDoRemove,
  update: debugStateValueUpdate,
});

function debugStateValueGetInitialState() {
  this.update = R.debounce(250, R.bind(this.update, this));
  this.path = R.reject(R.isNil, [...this.props.path, this.props.name]);
  return { value: this.props.value };
}

function debugStateValueRender() {
  const value = (this.lastPropsValue !== this.props.value
                 ? this.props.value
                 : this.state.value
                );
  this.lastPropsValue = this.props.value;
  const type = ( R.type(this.props.value) === 'Number'
                 ? 'number'
                 : 'text'
               );
  return (
    <span>
      <button className="action"
              onClick={this.doRemove}>
        <Icon name="trash" />
      </button>
      <input
         type={type}
         value={R.defaultTo('', value)}
         onChange={this.doChange}
         />
    </span>
  );
}

function debugStateValueDoChange(event) {
  this.setState({ value: event.target.value });
  console.log('change', this.props.value, this.state.value, event.target.value);
  this.update();
}

function debugStateValueUpdate() {
  console.log('update', this.props.value, this.state.value);
  dispatch(['debug-set', this.path, this.state.value]);
}

function debugStateValueDoRemove() {
  dispatch(['debug-remove', this.path]);
}
