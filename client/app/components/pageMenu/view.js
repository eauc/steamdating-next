export let __hotReload = true;

import R from 'ramda';
import React from 'react';
import styles from 'app/helpers/styles';
import { Icon } from 'app/components/misc/view';

export const PageMenu = styles.decorator(React.createClass({
  displayName: 'PageMenu',
  render: pageMenuRender,
  getInitialState: pageMenuGetInitialState,
  toggleShow: pageMenuToggleShow
}));

function pageMenuRender() {
  return (
    <div className={{
           'show': this.state.show
         }}>
      {this.props.children}
      <PageMenuToggle onToggle={this.toggleShow}
                      show={this.state.show} />
    </div>
  );
}

function pageMenuGetInitialState() {
  this.toggleShow = R.bind(this.toggleShow, this);
  return {show: false};
}

function pageMenuToggleShow() {
  this.setState({show: !this.state.show});
}

const PageMenuToggle = styles.decorator(React.createClass({
  displayName: 'PageMenuToggle',
  render: pageMenuToggleRender
}));

function pageMenuToggleRender() {
  return (
    <button onClick={this.props.onToggle}>
      <Icon name={this.props.show ? 'chevron-down' : 'chevron-up'} />
    </button>
  );
}

export const PageMenuItem = styles.decorator(React.createClass({
  displayName: 'PageMenuItem',
  render: pageMenuItemRender
}));

function pageMenuItemRender() {
  return (
    <a onClick={this.props.onClick}>
      {this.props.children}
    </a>
  );
}
