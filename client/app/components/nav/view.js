export let __hotReload = true;

import R from 'ramda';
import React from 'react';
import log from 'app/services/log';

export const Nav = React.createClass({
  render: navRender,
  getInitialState: navGetInitialState,
  updateState: navUpdateState,
  toggleShow: navToggleShow,
  componentWillMount: navComponentWillMount,
  componentWillUnmount: navComponentWillUnmount
});

function navRender() {
  // log.info('Nav render');
  return (
    <div className={`sd-nav-menu-wrap ${this.state.show ? 'show' : ''}`}>
      <NavLink current_hash={this.state.current_hash}
               path="/home">Home</NavLink>
      <NavLink current_hash={this.state.current_hash}
               path="/about">About</NavLink>
      <NavToggle onToggle={this.toggleShow} />
    </div>
  );
}

function navGetInitialState() {
  return {
    current_hash: self.location.hash,
    show: false
  };
}

function navUpdateState() {
  this.setState({
    current_hash: self.location.hash
  });
}

function navToggleShow() {
  this.setState({
    show: !this.state.show
  });
}

function navComponentWillMount() {
  this.updateState = R.bind(this.updateState, this);
  this.toggleShow = R.bind(this.toggleShow, this);
  self.addEventListener('hashchange', this.updateState);
}

function navComponentWillUnmount() {
  self.removeEventListener('hashchange', this.updateState);
}

const NavLink = React.createClass({
  render: navLinkRender
});

function navLinkRender() {
  // log.info('NavLink render', this.props.path);
  const hash = `#${this.props.path}`;
  const is_active = this.props.current_hash.startsWith(hash);
  return (
    <a href={hash}
       className={`sd-nav-item ${is_active ? 'active' : '' }`}>
      {this.props.children}
    </a>
  );
}

const NavToggle = React.createClass({
  render: navToggleRender
});

function navToggleRender() {
  // log.info('NavToggle render');
  return (
    <button onClick={this.props.onToggle}
            className="sd-nav-toggle">
      <span className="fa fa-bars"></span>
    </button>
  );
}
