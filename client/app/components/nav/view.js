export let __hotReload = true;

import R from 'ramda';
import React from 'react';
import pureRenderMixin from 'react-addons-pure-render-mixin';
import styles from 'app/helpers/styles';
import { Icon } from 'app/components/misc/view.js';

export const NavMenu = styles.decorator(React.createClass({
  displayName: 'NavMenu',
  mixins: [ pureRenderMixin ],
  render: navMenuRender,
  getInitialState: navMenuGetInitialState,
  updateState: navMenuUpdateState,
  toggleShow: navMenuToggleShow,
  componentWillMount: navMenuComponentWillMount,
  componentWillUnmount: navMenuComponentWillUnmount
}));

function navMenuRender() {
  return (
    <div className={{
           'show': this.state.show
         }}>
      <NavLink current_hash={this.state.current_hash}
               path="/home">Home</NavLink>
      <NavLink current_hash={this.state.current_hash}
               path="/about">About</NavLink>
      <NavToggle onToggle={this.toggleShow} />
    </div>
  );
}

function navMenuGetInitialState() {
  return {
    current_hash: self.location.hash,
    show: false
  };
}

function navMenuUpdateState() {
  this.setState({
    current_hash: self.location.hash
  });
}

function navMenuToggleShow() {
  this.setState({
    show: !this.state.show
  });
}

function navMenuComponentWillMount() {
  this.updateState = R.bind(this.updateState, this);
  this.toggleShow = R.bind(this.toggleShow, this);
  self.addEventListener('hashchange', this.updateState);
}

function navMenuComponentWillUnmount() {
  self.removeEventListener('hashchange', this.updateState);
}

const NavLink = styles.decorator(React.createClass({
  displayName: 'NavItem',
  render: navLinkRender
}));

function navLinkRender() {
  const hash = `#${this.props.path}`;
  const is_active = this.props.current_hash.startsWith(hash);
  return (
    <a href={hash}
       className={{
         'active': is_active
       }}>
      {this.props.children}
    </a>
  );
}

const NavToggle = styles.decorator(React.createClass({
  displayName: 'NavToggle',
  render: navToggleRender
}));

function navToggleRender() {
  return (
    <button onClick={this.props.onToggle}>
      <Icon name="bars" />
    </button>
  );
}
