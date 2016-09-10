export let __hotReload = true;

import R from 'app/helpers/ramda';
import React from 'react';
import ReactDOM from 'react-dom';
import styles from 'app/helpers/styles';
import { dispatch } from 'app/services/state';

export const FileOpenButton = styles.decorator(React.createClass({
  displayName: 'FileOpenButton',
  render: fileOpenButtonRender,
  getInitialState: fileOpenButtonGetInitialState,
  onChange: fileOpenButtonOnChange
}));

function fileOpenButtonRender() {
  return (
    <div>
      <input className="input"
             ref="input"
             type="file"
             onChange={this.onChange} />
        <button className="button"
                type="button">
          {this.props.children}
        </button>
    </div>
  );
}

function fileOpenButtonGetInitialState() {
  this.onChange = R.bind(this.onChange, this);
  return {};
}

function fileOpenButtonOnChange(event) {
  dispatch([this.props.onOpen, event.target.files[0]]);
  ReactDOM.findDOMNode(this.refs.input).blur();
}
