export let __hotReload = true;

import { dispatch } from 'app/services/state';
import ReactDOM from 'react-dom';
/* eslint-disable no-unused-vars */
import { React, createComponent } from 'app/helpers/react';
/* eslint-enable no-unused-vars */

export const FileOpenButton = createComponent({
  displayName: 'FileOpenButton',
  render: fileOpenButtonRender,
  getInitialState: fileOpenButtonGetInitialState,
  doChange: fileOpenButtonDoChange,
});

function fileOpenButtonRender() {
  const id = `fileOpen.${this.props.name}`;
  return (
    <div>
      <input className="input"
             id={id}
             ref="input"
             type="file"
             onChange={this.doChange} />
      <label className="button"
             htmlFor={id}>
        {this.props.children}
      </label>
    </div>
  );
}

function fileOpenButtonGetInitialState() {
  return {};
}

function fileOpenButtonDoChange(event) {
  dispatch([this.props.onOpen, event.target.files[0]]);
  ReactDOM.findDOMNode(this.refs.input).value = null;
}
