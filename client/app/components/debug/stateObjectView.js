export let __hotReload = true;

import R from 'app/helpers/ramda';
import stateService from 'app/services/state';
const { dispatch } = stateService;
/* eslint-disable no-unused-vars */
import { React, createComponent } from 'app/helpers/react';
import { Icon } from 'app/components/misc/misc';
import { DebugStateValue } from 'app/components/debug/stateValueView';
/* eslint-enable no-unused-vars */

export const DebugStateObject = createComponent({
  displayName: 'DebugStateObject',
  getInitialState: debugStateObjectGetInitialState,
  render: debugStateObjectRender,
  doToggleShow: debugStateObjectDoToggleShow,
  doRemove: debugStateObjectDoRemove,
});

function debugStateObjectGetInitialState() {
  this.path = R.reject(R.isNil, [...this.props.path, this.props.name]);
  return { show: false };
}

function debugStateObjectRender() {
  const keys = (R.type(this.props.object) === 'Array'
                ? R.range(0, this.props.object.length)
                : R.keys(this.props.object)
               );
  const placeholder = (R.type(this.props.object) === 'Array'
                       ? '[...]'
                       : '{...}'
                      );
  const entries = R.map((key) => {
    const value = this.props.object[key];
    const label = `${key}${R.prop('id', value || {}) ? `[${value.id}]` : ''}${R.prop('name', value || {}) ? `:${value.name}` : ''}`;
    return (
      <tr key={key}>
        <td>
          {label}
        </td>
        <td>
          {debugStateValue(this.path, key, value)}
        </td>
      </tr>
    );
  }, keys);
  return this.state.show
    ? (
      <span>
        <button className="action"
                onClick={this.doToggleShow}>
          <Icon name="level-up" />
        </button>
        <button className="action"
                onClick={this.doRemove}>
          <Icon name="trash" />
        </button>
        <table>
          <tbody>
            {entries}
          </tbody>
        </table>
      </span>
    ) : (
      <span className="toggle"
            onClick={this.doToggleShow}>
        {placeholder}
      </span>
    );
}

function debugStateObjectDoToggleShow() {
  this.setState({ show: !this.state.show });
}

function debugStateObjectDoRemove() {
  dispatch(['debug-remove', this.path]);
}

function debugStateValue(path, name, value) {
  const type = R.type(value);
  if ('Object' === type ||
      'Array' === type) {
    return (
      <DebugStateObject
         path={path}
         name={name}
         object={value}>
      </DebugStateObject>
    );
  }
  if ('String' === type ||
      'Number' === type ||
      'Null' === type) {
    return (
      <DebugStateValue
         path={path}
         name={name}
         value={value}>
      </DebugStateValue>
    );
  }
  return (<span>{type}</span>);
}
