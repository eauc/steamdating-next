export let __hotReload = true;

import R from 'ramda';
import React from 'react';

export const Menu = React.createClass({
  render: menuRender,
  getInitialState: menuGetInitialState,
  toggleShow: menuToggleShow
});

function menuRender() {
  return (
    <div className={`sd-menu ${this.state.show ? 'show' : ''}`}>
      {this.props.children}
      <MenuToggle onToggle={this.toggleShow}
                  show={this.state.show} />
    </div>
  );
}

function menuGetInitialState() {
  this.toggleShow = R.bind(this.toggleShow, this);
  return {show: false};
}

function menuToggleShow() {
  this.setState({show: !this.state.show});
}

const MenuToggle = React.createClass({
  render: menuToggleRender
});

function menuToggleRender() {
  return (
    <button onClick={this.props.onToggle}
            className="sd-menu-toggle">
      <span className={`fa ${this.props.show ? 'fa-chevron-down' : 'fa-chevron-up'}`}></span>
    </button>
  );
}

export const MenuItem = React.createClass({
  render: menuItemRender
});

function menuItemRender() {
  return (
    <a onClick={this.props.onClick}
       className="sd-menu-item">
      {this.props.children}
    </a>
  );
}
